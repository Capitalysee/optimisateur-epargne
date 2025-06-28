import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Clé secrète de signature webhook Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('🔄 === WEBHOOK STRIPE APPELÉ ===');
  console.log('📧 URL reçue:', req.url);
  console.log('📅 Timestamp:', new Date().toISOString());
  
  const sig = req.headers.get('stripe-signature') || '';
  const rawBody = await req.text();

  console.log('📝 Signature Stripe reçue:', sig ? 'OUI' : 'NON');
  console.log('📄 Taille du body:', rawBody.length, 'caractères');

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log('✅ Événement Stripe validé:', event.type);
  } catch (err) {
    console.error('❌ Erreur signature webhook:', err);
    return NextResponse.json({ error: 'Signature Stripe invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('💰 === PAIEMENT COMPLÉTÉ ===');
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('📊 Session complète:', JSON.stringify(session, null, 2));
    
    // Récupérer l'email depuis les métadonnées ou customer_email
    const email = session.metadata?.userEmail || session.customer_email || session.customer_details?.email;
    console.log('📧 Email trouvé:', email);
    console.log('🔍 Métadonnées:', session.metadata);
    console.log('👤 Customer email:', session.customer_email);
    console.log('📋 Customer details:', session.customer_details);
    
    if (email) {
      console.log('🔄 Mise à jour Supabase pour:', email);
      
      // Vérifier d'abord si l'utilisateur existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (checkError) {
        console.log('⚠️ Utilisateur non trouvé dans Supabase:', email);
        console.log('❌ Erreur de recherche:', checkError);
        
        // Créer l'utilisateur s'il n'existe pas
        console.log('➕ Création de l\'utilisateur...');
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ email: email, offre: 'premium' }])
          .select();
        
        if (createError) {
          console.error('❌ Erreur création utilisateur:', createError);
        } else {
          console.log('✅ Utilisateur créé avec succès:', newUser);
        }
      } else {
        console.log('✅ Utilisateur trouvé:', existingUser);
        
        // Mettre à jour l'offre
        const { data, error } = await supabase
          .from('users')
          .update({ offre: 'premium' })
          .eq('email', email)
          .select();
        
        if (error) {
          console.error('❌ Erreur mise à jour Supabase:', error);
          console.error('🔍 Détails de l\'erreur:', JSON.stringify(error, null, 2));
        } else {
          console.log('✅ Utilisateur mis à jour avec succès:', data);
        }
      }
    } else {
      console.log('❌ Aucun email trouvé dans la session');
      console.log('🔍 Session complète pour debug:', JSON.stringify(session, null, 2));
    }
  } else {
    console.log('ℹ️ Événement non traité:', event.type);
  }

  console.log('🏁 === FIN DU WEBHOOK ===');
  return NextResponse.json({ received: true });
} 
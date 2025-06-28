import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const { email, phone, name } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }
  
  // Debug: vérifier les variables d'environnement
  console.log('=== DEBUG REGISTER ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('EMAIL_PASS existe:', !!process.env.EMAIL_PASS);
  console.log('EMAIL_PASS longueur:', process.env.EMAIL_PASS?.length);
  console.log('EMAIL_PASS début:', process.env.EMAIL_PASS?.substring(0, 4) + '...');
  console.log('=== NOUVELLE INSCRIPTION ===');
  console.log('Données utilisateur:', { email, phone, name });
  
  try {
    // Enregistrer l'utilisateur en base de données Supabase
    const { data, error } = await supabase
      .from('Inscriptions')
      .insert([
        {
          email,
          nom: name,
          telephone: phone,
          'date inscription': new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    console.log('Inscription enregistrée avec succès:', data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
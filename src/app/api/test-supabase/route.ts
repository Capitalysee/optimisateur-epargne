import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  console.log('🧪 === TEST SUPABASE ===');
  
  try {
    // Test de mise à jour d'un utilisateur
    const testEmail = 'anselme.drugeon@gmail.com'; // Remplace par ton email
    
    console.log('📧 Test avec email:', testEmail);
    
    // Vérifier si l'utilisateur existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (checkError) {
      console.log('❌ Utilisateur non trouvé:', checkError);
      
      // Créer l'utilisateur
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ email: testEmail, offre: 'premium' }])
        .select();
      
      if (createError) {
        console.error('❌ Erreur création:', createError);
        return NextResponse.json({ error: createError }, { status: 500 });
      } else {
        console.log('✅ Utilisateur créé:', newUser);
        return NextResponse.json({ success: true, user: newUser });
      }
    } else {
      console.log('✅ Utilisateur trouvé:', existingUser);
      
      // Mettre à jour l'offre
      const { data, error } = await supabase
        .from('users')
        .update({ offre: 'premium' })
        .eq('email', testEmail)
        .select();
      
      if (error) {
        console.error('❌ Erreur mise à jour:', error);
        return NextResponse.json({ error: error }, { status: 500 });
      } else {
        console.log('✅ Utilisateur mis à jour:', data);
        return NextResponse.json({ success: true, user: data });
      }
    }
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 
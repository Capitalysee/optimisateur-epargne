import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const { email, nom, answers, score } = await req.json();
  
  console.log('=== DEBUG QUIZ COMPLETED ===');
  console.log('Email:', email);
  console.log('Nom:', nom);
  console.log('Score:', score);
  console.log('Answers:', answers);
  
  if (!email || !answers || score === undefined) {
    console.log('❌ Données manquantes');
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
  }

  try {
    // Sauvegarder les réponses du quiz en base de données
    const { data, error } = await supabase
      .from('quiz_reponses')
      .insert([
        {
          email,
          nom,
          reponses: answers,
          score,
          date_completion: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    console.log('✅ Quiz complété et sauvegardé:', { email, nom, score, date: new Date().toLocaleString('fr-FR') });
    console.log('✅ Données insérées:', data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du quiz:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
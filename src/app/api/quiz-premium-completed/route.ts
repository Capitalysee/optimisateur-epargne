import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, answers, score } = await request.json();

    console.log('📥 Données reçues:', { email, score, answersCount: Object.keys(answers || {}).length });

    if (!email || !answers || score === undefined) {
      console.error('❌ Données manquantes:', { email: !!email, answers: !!answers, score });
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('❌ Erreur lors de la vérification utilisateur:', userError);
      // Créer l'utilisateur s'il n'existe pas
      const { error: insertUserError } = await supabase
        .from('users')
        .insert({ email: email, offre: 'premium' })
        .single();

      if (insertUserError) {
        console.error('❌ Erreur lors de la création utilisateur:', insertUserError);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la création utilisateur' },
          { status: 500 }
        );
      }
    }

    // Vérifier si des réponses existent déjà pour cet utilisateur
    const { data: existingResponse, error: checkError } = await supabase
      .from('quiz_premium_responses')
      .select('id')
      .eq('email', email)
      .single();

    let result;
    if (existingResponse) {
      // Mettre à jour les réponses existantes
      const { data, error } = await supabase
        .from('quiz_premium_responses')
        .update({
          score: score,
          answers: answers,
          created_at: new Date().toISOString()
        })
        .eq('email', email)
        .select();

      if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la mise à jour' },
          { status: 500 }
        );
      }
      result = data;
    } else {
      // Insérer de nouvelles réponses
      const { data, error } = await supabase
        .from('quiz_premium_responses')
        .insert({
          email: email,
          score: score,
          answers: answers,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('❌ Erreur lors de l\'insertion:', error);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de l\'insertion' },
          { status: 500 }
        );
      }
      result = data;
    }

    console.log('✅ Réponses du questionnaire premium sauvegardées pour:', email);
    console.log('Score:', score);
    console.log('Nombre de réponses:', Object.keys(answers).length);

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ Erreur lors du traitement des réponses premium:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 
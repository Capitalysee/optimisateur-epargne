"use client";
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FiArrowRight, FiCheck, FiTrendingUp, FiBarChart, FiTarget, FiShield } from 'react-icons/fi';

// Types pour les questions
interface Question {
  key: string;
  label: string;
  type: 'radio' | 'checkboxes' | 'slider' | 'number';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  condition?: (answers: Record<string, any>) => boolean;
  hasOther?: boolean;
  otherKey?: string;
}

// Définition du questionnaire premium avec les nouvelles questions
const quizPremiumFlow: Question[] = [
  // 🎯 Profil et stratégie
  {
    key: 'typeInvestisseur',
    label: "Quel type d'investisseur te ressemble le plus ?",
    type: 'radio',
    options: [
      "Sécuritaire (je privilégie la sécurité avant tout)",
      "Équilibré (un bon compromis risque/rendement)",
      "Dynamique (j'accepte le risque pour plus de rendement)",
      "Opportuniste (je recherche la performance maximale)"
    ],
  },
  {
    key: 'horizonInvestissement',
    label: "Quel est ton horizon d'investissement idéal ?",
    type: 'radio',
    options: [
      "Moins de 3 ans",
      "3 à 7 ans",
      "7 à 15 ans",
      "Plus de 15 ans"
    ],
  },
  {
    key: 'perteFinanciere',
    label: "As-tu déjà connu une perte financière importante ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'influencePerte',
    label: "Si oui, cela influence-t-il tes décisions aujourd'hui ?",
    type: 'radio',
    options: [
      "Oui, je limite le risque",
      "Non, j'ai appris à gérer"
    ],
    condition: (answers: Record<string, any>) => answers.perteFinanciere === "Oui",
  },
  {
    key: 'preferenceRevenus',
    label: "Préférerais-tu recevoir des revenus réguliers ou laisser ton capital croître ?",
    type: 'radio',
    options: [
      "Des revenus réguliers",
      "Plutôt la croissance du capital",
      "Un peu des deux"
    ],
  },

  // 💸 Patrimoine et revenus
  {
    key: 'patrimoineFinancier',
    label: "Quel est ton patrimoine financier total (hors résidence principale) ?",
    type: 'radio',
    options: [
      "Moins de 50 000 €",
      "50 000 – 150 000 €",
      "150 000 – 500 000 €",
      "Plus de 500 000 €"
    ],
  },
  {
    key: 'tauxEpargne',
    label: "Quelle part de tes revenus arrives-tu à épargner chaque mois ?",
    type: 'radio',
    options: [
      "Moins de 5 %",
      "5 à 10 %",
      "10 à 20 %",
      "Plus de 20 %"
    ],
  },
  {
    key: 'creditsEnCours',
    label: "As-tu des crédits en cours (hors prêt immobilier principal) ?",
    type: 'radio',
    options: [
      "Aucun",
      "Crédit consommation/auto",
      "Prêt immobilier locatif"
    ],
    hasOther: true,
    otherKey: 'creditsEnCoursAutre',
  },

  // ⚙️ Habitudes d'investissement
  {
    key: 'dernierInvestissement',
    label: "Quand as-tu fait ton dernier investissement ?",
    type: 'radio',
    options: [
      "Moins de 6 mois",
      "6 à 12 mois",
      "Plus de 12 mois",
      "Jamais"
    ],
  },
  {
    key: 'priseDecision',
    label: "Comment prends-tu tes décisions d'investissement ?",
    type: 'radio',
    options: [
      "Tout seul",
      "Avec un conseiller",
      "Via une plateforme automatisée",
      "Je n'ai pas vraiment de méthode"
    ],
  },
  {
    key: 'outilSuivi',
    label: "Utilises-tu un outil pour suivre tes placements ?",
    type: 'radio',
    options: [
      "Non",
      "Oui, un tableau (Excel, Google Sheets)",
      "Oui, une application dédiée"
    ],
  },
  {
    key: 'automatisation',
    label: "Souhaites-tu automatiser une partie de tes placements ?",
    type: 'radio',
    options: [
      "Oui",
      "Non",
      "Je ne sais pas"
    ],
  },

  // 🌍 Diversification et supports
  {
    key: 'immobilierIndirect',
    label: "Es-tu intéressé par l'immobilier indirect (SCPI, SIIC, foncières cotées) ?",
    type: 'radio',
    options: [
      "Oui",
      "Non",
      "Je ne sais pas"
    ],
  },
  {
    key: 'investissementInternational',
    label: "Es-tu prêt à investir à l'international ?",
    type: 'radio',
    options: [
      "Oui, sans problème",
      "Oui, mais je ne sais pas comment faire",
      "Non, je préfère rester en France"
    ],
  },
  {
    key: 'cryptomonnaies',
    label: "Que penses-tu des crypto-monnaies ?",
    type: 'radio',
    options: [
      "J'investis déjà",
      "Je suis curieux mais pas encore lancé",
      "Ça ne m'intéresse pas"
    ],
  },
  {
    key: 'investissementResponsable',
    label: "Souhaites-tu intégrer l'investissement responsable (ISR/ESG) ?",
    type: 'radio',
    options: [
      "Oui, c'est important pour moi",
      "Pourquoi pas, si ça ne réduit pas la performance",
      "Non"
    ],
  },

  // 🛡️ Gestion du risque et fiscalité
  {
    key: 'optimisationFiscale',
    label: "As-tu déjà optimisé ta fiscalité grâce à tes placements ?",
    type: 'radio',
    options: [
      "Oui",
      "Non",
      "Je ne sais pas comment faire"
    ],
  },
  {
    key: 'blocageFiscal',
    label: "Serais-tu prêt à bloquer ton argent plus longtemps pour payer moins d'impôts ?",
    type: 'radio',
    options: [
      "Oui",
      "Non",
      "Ça dépend"
    ],
  },
  {
    key: 'reactionBaisse',
    label: "Si tes placements baissent temporairement, que fais-tu ?",
    type: 'radio',
    options: [
      "Je revends vite pour limiter les pertes",
      "J'attends sans trop stresser",
      "J'en profite pour racheter à prix bas"
    ],
  },

  // ✅ Objectifs spécifiques
  {
    key: 'objectifPrincipal',
    label: "Ton objectif financier principal aujourd'hui ?",
    type: 'radio',
    options: [
      "Préparer ma retraite",
      "Créer un revenu passif",
      "Protéger mon capital",
      "Atteindre l'indépendance financière",
      "Autre"
    ],
    hasOther: true,
    otherKey: 'objectifPrincipalAutre',
  },
  {
    key: 'revenuComplémentaire',
    label: "Quel revenu annuel complémentaire aimerais-tu générer grâce à tes placements ?",
    type: 'radio',
    options: [
      "5%",
      "7%",
      "10%",
      "20%"
    ],
  },
  {
    key: 'transmissionPatrimoine',
    label: "Souhaites-tu transmettre ton patrimoine à tes proches ?",
    type: 'radio',
    options: [
      "Oui",
      "Non",
      "Pas encore réfléchi"
    ],
  },
  {
    key: 'freinPrincipal',
    label: "Ton principal frein pour passer au niveau supérieur ?",
    type: 'radio',
    options: [
      "Manque de temps",
      "Manque de connaissances",
      "Manque de budget",
      "Peur de me tromper"
    ],
  },
  {
    key: 'tempsConsacre',
    label: "Combien de temps es-tu prêt à consacrer à tes placements chaque mois ?",
    type: 'radio',
    options: [
      "Moins de 1h",
      "1 à 3h",
      "3 à 5h",
      "Plus de 5h"
    ],
  },
  {
    key: 'alertes',
    label: "Veux-tu recevoir des alertes en cas de risques ou d'opportunités importantes ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
];

function computePremiumScore(answers: Record<string, any>): number {
  let score = 0;
  let maxScore = 0;

  // 🎯 Profil et stratégie
  if (answers.typeInvestisseur) {
    const profilScores: Record<string, number> = { 
      "Sécuritaire (je privilégie la sécurité avant tout)": 25, 
      "Équilibré (un bon compromis risque/rendement)": 50, 
      "Dynamique (j'accepte le risque pour plus de rendement)": 75, 
      "Opportuniste (je recherche la performance maximale)": 100 
    };
    score += profilScores[answers.typeInvestisseur] || 0;
    maxScore += 100;
  }

  if (answers.horizonInvestissement) {
    const horizonScores: Record<string, number> = { 
      "Moins de 3 ans": 25, 
      "3 à 7 ans": 50, 
      "7 à 15 ans": 75, 
      "Plus de 15 ans": 100 
    };
    score += horizonScores[answers.horizonInvestissement] || 0;
    maxScore += 100;
  }

  if (answers.preferenceRevenus) {
    const revenusScores: Record<string, number> = { 
      "Des revenus réguliers": 40, 
      "Plutôt la croissance du capital": 60, 
      "Un peu des deux": 80 
    };
    score += revenusScores[answers.preferenceRevenus] || 0;
    maxScore += 80;
  }

  // 💸 Patrimoine et revenus
  if (answers.patrimoineFinancier) {
    const patrimoineScores: Record<string, number> = { 
      "Moins de 50 000 €": 25, 
      "50 000 – 150 000 €": 50, 
      "150 000 – 500 000 €": 75, 
      "Plus de 500 000 €": 100 
    };
    score += patrimoineScores[answers.patrimoineFinancier] || 0;
    maxScore += 100;
  }

  if (answers.tauxEpargne) {
    const epargneScores: Record<string, number> = { 
      "Moins de 5 %": 25, 
      "5 à 10 %": 50, 
      "10 à 20 %": 75, 
      "Plus de 20 %": 100 
    };
    score += epargneScores[answers.tauxEpargne] || 0;
    maxScore += 100;
  }

  // ⚙️ Habitudes d'investissement
  if (answers.dernierInvestissement) {
    const investissementScores: Record<string, number> = { 
      "Moins de 6 mois": 100, 
      "6 à 12 mois": 75, 
      "Plus de 12 mois": 50, 
      "Jamais": 25 
    };
    score += investissementScores[answers.dernierInvestissement] || 0;
    maxScore += 100;
  }

  if (answers.priseDecision) {
    const decisionScores: Record<string, number> = { 
      "Tout seul": 80, 
      "Avec un conseiller": 60, 
      "Via une plateforme automatisée": 70, 
      "Je n'ai pas vraiment de méthode": 30 
    };
    score += decisionScores[answers.priseDecision] || 0;
    maxScore += 80;
  }

  if (answers.outilSuivi) {
    const suiviScores: Record<string, number> = { 
      "Non": 25, 
      "Oui, un tableau (Excel, Google Sheets)": 70, 
      "Oui, une application dédiée": 100 
    };
    score += suiviScores[answers.outilSuivi] || 0;
    maxScore += 100;
  }

  if (answers.automatisation) {
    const autoScores: Record<string, number> = { 
      "Oui": 100, 
      "Non": 30, 
      "Je ne sais pas": 50 
    };
    score += autoScores[answers.automatisation] || 0;
    maxScore += 100;
  }

  // 🌍 Diversification et supports
  if (answers.immobilierIndirect) {
    const immoScores: Record<string, number> = { 
      "Oui": 80, 
      "Non": 30, 
      "Je ne sais pas": 50 
    };
    score += immoScores[answers.immobilierIndirect] || 0;
    maxScore += 80;
  }

  if (answers.investissementInternational) {
    const internationalScores: Record<string, number> = { 
      "Oui, sans problème": 100, 
      "Oui, mais je ne sais pas comment faire": 70, 
      "Non, je préfère rester en France": 40 
    };
    score += internationalScores[answers.investissementInternational] || 0;
    maxScore += 100;
  }

  if (answers.cryptomonnaies) {
    const cryptoScores: Record<string, number> = { 
      "J'investis déjà": 80, 
      "Je suis curieux mais pas encore lancé": 60, 
      "Ça ne m'intéresse pas": 30 
    };
    score += cryptoScores[answers.cryptomonnaies] || 0;
    maxScore += 80;
  }

  if (answers.investissementResponsable) {
    const responsableScores: Record<string, number> = { 
      "Oui, c'est important pour moi": 80, 
      "Pourquoi pas, si ça ne réduit pas la performance": 60, 
      "Non": 40 
    };
    score += responsableScores[answers.investissementResponsable] || 0;
    maxScore += 80;
  }

  // 🛡️ Gestion du risque et fiscalité
  if (answers.optimisationFiscale) {
    const fiscalScores: Record<string, number> = { 
      "Oui": 100, 
      "Non": 30, 
      "Je ne sais pas comment faire": 50 
    };
    score += fiscalScores[answers.optimisationFiscale] || 0;
    maxScore += 100;
  }

  if (answers.blocageFiscal) {
    const blocageScores: Record<string, number> = { 
      "Oui": 80, 
      "Non": 30, 
      "Ça dépend": 60 
    };
    score += blocageScores[answers.blocageFiscal] || 0;
    maxScore += 80;
  }

  if (answers.reactionBaisse) {
    const reactionScores: Record<string, number> = { 
      "Je revends vite pour limiter les pertes": 20, 
      "J'attends sans trop stresser": 60, 
      "J'en profite pour racheter à prix bas": 100 
    };
    score += reactionScores[answers.reactionBaisse] || 0;
    maxScore += 100;
  }

  // ✅ Objectifs spécifiques
  if (answers.objectifPrincipal) {
    const objectifScores: Record<string, number> = { 
      "Préparer ma retraite": 70, 
      "Créer un revenu passif": 80, 
      "Protéger mon capital": 60, 
      "Atteindre l'indépendance financière": 100, 
      "Autre": 50 
    };
    score += objectifScores[answers.objectifPrincipal] || 0;
    maxScore += 100;
  }

  if (answers.revenuComplémentaire) {
    const revenuScores: Record<string, number> = { 
      "Moins de 2 000 €": 40, 
      "2 000 – 5 000 €": 60, 
      "5 000 – 10 000 €": 80, 
      "Plus de 10 000 €": 100 
    };
    score += revenuScores[answers.revenuComplémentaire] || 0;
    maxScore += 100;
  }

  if (answers.transmissionPatrimoine) {
    const transmissionScores: Record<string, number> = { 
      "Oui": 80, 
      "Non": 40, 
      "Pas encore réfléchi": 60 
    };
    score += transmissionScores[answers.transmissionPatrimoine] || 0;
    maxScore += 80;
  }

  if (answers.freinPrincipal) {
    const freinScores: Record<string, number> = { 
      "Manque de temps": 60, 
      "Manque de connaissances": 40, 
      "Manque de budget": 30, 
      "Peur de me tromper": 50 
    };
    score += freinScores[answers.freinPrincipal] || 0;
    maxScore += 60;
  }

  if (answers.tempsConsacre) {
    const tempsScores: Record<string, number> = { 
      "Moins de 1h": 30, 
      "1 à 3h": 60, 
      "3 à 5h": 80, 
      "Plus de 5h": 100 
    };
    score += tempsScores[answers.tempsConsacre] || 0;
    maxScore += 100;
  }

  if (answers.alertes) {
    const alertesScores: Record<string, number> = { 
      "Oui": 80, 
      "Non": 40 
    };
    score += alertesScores[answers.alertes] || 0;
    maxScore += 80;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

export default function QuestionnairePremium() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  const handleNext = () => {
    let nextQuestion = currentQuestion + 1;
    
    // Passer les questions conditionnelles qui ne s'appliquent pas
    while (nextQuestion < quizPremiumFlow.length) {
      const nextQ = quizPremiumFlow[nextQuestion];
      if (!nextQ.condition || nextQ.condition(answers)) {
        break;
      }
      nextQuestion++;
    }
    
    if (nextQuestion < quizPremiumFlow.length) {
      setCurrentQuestion(nextQuestion);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const finalScore = computePremiumScore(answers);
    setScore(finalScore);
    
    // Sauvegarder les résultats avec l'email de l'utilisateur
    const userEmail = user?.email;
    if (userEmail) {
      localStorage.setItem(`quizPremiumDone_${userEmail}`, 'true');
      localStorage.setItem(`quizPremiumScore_${userEmail}`, finalScore.toString());
      localStorage.setItem(`quizPremiumAnswers_${userEmail}`, JSON.stringify(answers));
    }
    
    // Envoyer les réponses à Supabase
    try {
      console.log('📤 Envoi des réponses premium:', { email: userEmail, score: finalScore, answersCount: Object.keys(answers).length });
      
      const response = await fetch('/api/quiz-premium-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          answers: answers,
          score: finalScore
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('❌ Erreur API quiz premium:', responseData);
        console.error('Status:', response.status);
      } else {
        console.log('✅ Réponses du questionnaire premium envoyées avec succès');
        console.log('Réponse:', responseData);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des réponses premium:', error);
    }
    
    setShowResults(true);
    setLoading(false);
  };

  const handleAnswerChange = (key: string, value: any) => {
    setAnswers((prev: Record<string, any>) => ({
      ...prev,
      [key]: value
    }));
  };

  const currentQ = quizPremiumFlow[currentQuestion];
  const isLastQuestion = currentQuestion === quizPremiumFlow.length - 1;
  
  // Vérifier si la question actuelle doit être affichée (condition)
  const shouldShowQuestion = !currentQ.condition || currentQ.condition(answers);
  
  // Vérifier si on peut passer à la question suivante
  const canProceed = shouldShowQuestion && (
    answers[currentQ.key] !== undefined && 
    answers[currentQ.key] !== '' && 
    (answers[currentQ.key] !== "Autre" || (currentQ.otherKey && answers[currentQ.otherKey]))
  );

  // Si la question actuelle ne doit pas être affichée, passer à la suivante
  if (!shouldShowQuestion) {
    handleNext();
    return null;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background Particles */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-500/40 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-6 text-white">Questionnaire Premium terminé !</h1>
              <p className="text-xl text-gray-300 mb-8">
                Votre profil d'investisseur premium a été analysé avec succès.
              </p>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Score Premium : {score}%</h2>
                <p className="text-gray-300">
                  Basé sur vos réponses, nous avons identifié votre niveau d'optimisation premium.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                  <FiTarget className="text-2xl text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Stratégies Avancées</h3>
                  <p className="text-gray-300 text-sm">
                    Accédez à des stratégies d'investissement sophistiquées et des outils de gestion de portefeuille.
                  </p>
                </div>
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                  <FiShield className="text-2xl text-pink-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Accompagnement Premium</h3>
                  <p className="text-gray-300 text-sm">
                    Bénéficiez d'un suivi personnalisé et de conseils d'experts en investissement.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">Prochaines étapes</h3>
                <p className="text-white text-lg mb-4">
                  Nous vous contacterons dans <span className="font-bold text-emerald-400">24h au plus tard</span> avec un rapport détaillé fait par nos experts.
                </p>
                <p className="text-gray-300">
                  Notre équipe d'experts analyse actuellement vos réponses pour préparer des recommandations personnalisées adaptées à votre profil d'investisseur premium.
                </p>
              </div>

              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Retour au dashboard
                <FiArrowRight className="ml-2 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-500/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-white">Questionnaire Premium</h1>
            <p className="text-xl text-gray-300">
              Analyse approfondie de votre profil d'investisseur
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} sur {quizPremiumFlow.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quizPremiumFlow.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizPremiumFlow.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">{currentQ.label}</h2>

            {/* Question Input */}
            {currentQ.type === 'radio' && (
              <div className="space-y-4">
                {currentQ.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name={currentQ.key}
                      value={option}
                      checked={answers[currentQ.key] === option}
                      onChange={(e) => handleAnswerChange(currentQ.key, e.target.value)}
                      className="mr-3 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
                
                {/* Champ "Autre" si la question le permet */}
                {currentQ.hasOther && (
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name={currentQ.key}
                        value="Autre"
                        checked={answers[currentQ.key] === "Autre"}
                        onChange={(e) => handleAnswerChange(currentQ.key, e.target.value)}
                        className="mr-3 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-white">Autre</span>
                    </label>
                    {answers[currentQ.key] === "Autre" && currentQ.otherKey && (
                      <input
                        type="text"
                        placeholder="Précisez..."
                        value={answers[currentQ.otherKey] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.otherKey!, e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {currentQ.type === 'checkboxes' && (
              <div className="space-y-4">
                {currentQ.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Array.isArray(answers[currentQ.key]) && answers[currentQ.key].includes(option)}
                      onChange={(e) => {
                        const currentValues = Array.isArray(answers[currentQ.key]) ? answers[currentQ.key] : [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option);
                        handleAnswerChange(currentQ.key, newValues);
                      }}
                      className="mr-3 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'slider' && currentQ.min !== undefined && currentQ.max !== undefined && currentQ.step !== undefined && (
              <div className="space-y-4">
                <input
                  type="range"
                  min={currentQ.min}
                  max={currentQ.max}
                  step={currentQ.step}
                  value={answers[currentQ.key] || currentQ.min}
                  onChange={(e) => handleAnswerChange(currentQ.key, parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center text-2xl font-bold text-purple-400">
                  {answers[currentQ.key] || currentQ.min}
                </div>
              </div>
            )}

            {currentQ.type === 'number' && (
              <input
                type="number"
                value={answers[currentQ.key] || ''}
                onChange={(e) => handleAnswerChange(currentQ.key, e.target.value)}
                placeholder="Entrez votre réponse"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyse en cours...' : 'Terminer l\'analyse'}
                <FiTrendingUp className="ml-2 inline" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <FiArrowRight className="ml-2 inline" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5CF6, #EC4899);
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5CF6, #EC4899);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
} 
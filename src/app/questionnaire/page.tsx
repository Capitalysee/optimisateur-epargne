"use client";
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FiArrowRight, FiCheck, FiCheckCircle } from 'react-icons/fi';

// Définition du flow conditionnel du quiz
const quizFlow = [
  // 1. Livret A
  {
    key: 'livretA',
    label: "As-tu un Livret A ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'montantLivretA',
    label: "Quel est le montant actuel sur ton Livret A ? (en €)",
    type: 'number',
    condition: (answers: any) => answers.livretA === "Oui",
  },
  // 2. Investissement bourse
  {
    key: 'bourse',
    label: "Investis-tu actuellement en bourse ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'bourseFrein',
    label: "Qu'est-ce qui t'empêche aujourd'hui de te lancer ?",
    type: 'checkboxes',
    options: [
      "Je ne sais pas par où commencer",
      "J'ai peur de perdre de l'argent",
      "Je ne comprends pas comment ça fonctionne",
      "Je pense que c'est réservé à ceux qui ont beaucoup d'argent",
      "Je manque de temps",
      "Autre"
    ],
    condition: (answers: any) => answers.bourse === "Non",
    hasOther: true,
    otherKey: 'bourseFreinAutre',
  },
  // 3. PEA
  {
    key: 'pea',
    label: "As-tu un PEA (Plan d'Épargne en Actions) ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'peaSupports',
    label: "Dans quoi investis-tu via ton PEA ?",
    type: 'checkboxes',
    options: [
      "ETF",
      "Actions individuelles",
      "Fonds",
      "Autre",
      "Je ne sais pas"
    ],
    condition: (answers: any) => answers.pea === "Oui",
    hasOther: true,
    otherKey: 'peaSupportsAutre',
  },
  // 4. Assurance-vie
  {
    key: 'assuranceVie',
    label: "As-tu une assurance-vie ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'assuranceVieMontant',
    label: "Quel est le montant total investi dans ton assurance-vie ? (en €)",
    type: 'number',
    condition: (answers: any) => answers.assuranceVie === "Oui",
  },
  {
    key: 'assuranceVieSupports',
    label: "Sur quels supports ?",
    type: 'checkboxes',
    options: [
      "Fonds en euros",
      "Unités de compte",
      "SCPI",
      "Je ne sais pas",
      "Autre"
    ],
    condition: (answers: any) => answers.assuranceVie === "Oui",
    hasOther: true,
    otherKey: 'assuranceVieSupportsAutre',
  },
  // 5. Épargne de précaution
  {
    key: 'epargnePrecaution',
    label: "As-tu une épargne de précaution (argent dispo en cas d'imprévu) ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'epargnePrecautionMontant',
    label: "Combien environ ?",
    type: 'radio',
    options: [
      "Moins de 1 000 €",
      "Entre 1 000 € et 3 000 €",
      "Entre 3 000 € et 10 000 €",
      "Plus de 10 000 €"
    ],
    condition: (answers: any) => answers.epargnePrecaution === "Oui",
  },
  // 6. Autres supports d'investissement
  {
    key: 'autresSupports',
    label: "As-tu d'autres supports d'investissement, en dehors des livrets, assurance-vie et PEA ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'autresSupportsListe',
    label: "Lesquels ?",
    type: 'checkboxes',
    options: [
      "Immobilier locatif",
      "SCPI",
      "Crowdfunding",
      "Crypto-monnaies",
      "Métaux précieux (or, argent...)",
      "Autre"
    ],
    condition: (answers: any) => answers.autresSupports === "Oui",
    hasOther: true,
    otherKey: 'autresSupportsAutre',
  },
  // 7. Épargne mensuelle
  {
    key: 'epargneMensuelle',
    label: "Investis-tu régulièrement chaque mois ?",
    type: 'radio',
    options: ["Oui", "Non"],
  },
  {
    key: 'epargneMensuelleMontant',
    label: "Quel montant épargnes-tu environ par mois ?",
    type: 'radio',
    options: [
      "Moins de 50 €",
      "Entre 50 € et 100 €",
      "Entre 100 € et 300 €",
      "Plus de 300 €"
    ],
    condition: (answers: any) => answers.epargneMensuelle === "Oui",
  },
  // 8. Objectifs
  {
    key: 'objectifs',
    label: "Quels sont tes objectifs principaux ?",
    type: 'checkboxes',
    options: [
      "Me créer un revenu passif",
      "Préparer ma retraite",
      "Faire fructifier mon épargne",
      "Apprendre à investir efficacement",
      "Autre"
    ],
    hasOther: true,
    otherKey: 'objectifsAutre',
  },
  // 9. Niveau de connaissance
  {
    key: 'niveauConnaissance',
    label: "Sur une échelle de 0 à 10, à quel point te sens-tu à l'aise avec le monde de l'investissement ?",
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
  },
  // 10. Rapport au risque
  {
    key: 'risque',
    label: "Sur une échelle de 0 à 10, comment te situes-tu face au risque ?",
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
  },
];

const offers = [
  {
    title: 'Rapport détaillé personnalisé',
    price: '72€',
    description: 'Recevez immédiatement un rapport complet et personnalisé sur votre épargne.',
    stripePriceId: 'price_rapport',
  },
  {
    title: 'Rapport + Accompagnement expert',
    price: '349,50€',
    description: 'Rapport détaillé + session personnalisée avec un expert pour optimiser votre épargne.',
    stripePriceId: 'price_accompagnement',
  },
];

function computeScore(answers: any) {
  let score = 7;
  const montantLivretA = parseFloat(answers.montantLivretA || 0);
  const montantTotal = parseFloat(answers.montantTotal || 0);
  const epargneMensuelle = parseFloat(answers.epargneMensuelle || 0);
  if (montantLivretA > 5000) score += 1;
  if (montantTotal > 10000) score += 1;
  if (epargneMensuelle > 200) score += 1;
  if (answers.risque === 'Non') score += 1;
  if (score > 11) score = 11;
  if (score < 7) score = 7;
  return score;
}

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showScore, setShowScore] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [scoreBarVisible, setScoreBarVisible] = useState(false);
  const [offersVisible, setOffersVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Gestion du thème
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  // Filtrer les questions à afficher selon les conditions
  const visibleQuestions = quizFlow.filter(q => !q.condition || q.condition(answers));

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setShowScore(true);
    setTimeout(() => setScoreBarVisible(true), 100);
    
    const score = computeScore(answers);
    const userEmail = user?.email;
    
    if (typeof window !== 'undefined' && userEmail) {
      localStorage.setItem(`quizDone_${userEmail}`, 'true');
      localStorage.setItem(`quizAnswers_${userEmail}`, JSON.stringify(answers));
      localStorage.setItem(`quizScore_${userEmail}`, String(score));
    }
    
    // Envoi de notification par email et enregistrement dans quiz_reponses
    try {
      const email = user?.email || localStorage.getItem('userEmail');
      const nom = user?.user_metadata?.nom || localStorage.getItem('userName');
      
      console.log('=== DEBUG QUIZ SUBMIT ===');
      console.log('User:', user);
      console.log('User email:', user?.email);
      console.log('LocalStorage email:', localStorage.getItem('userEmail'));
      console.log('Final email:', email);
      console.log('Final nom:', nom);
      console.log('Answers:', answers);
      console.log('Score:', score);
      
      if (email) {
        const response = await fetch('/api/quiz-completed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            nom,
            answers: answers,
            score: score
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Erreur API:', errorData);
        } else {
          console.log('✅ Quiz envoyé avec succès');
        }
      } else {
        console.error('❌ Pas d\'email trouvé pour enregistrer le quiz');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification:', error);
    }
    
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setAnimatedScore(current);
      if (current >= score) {
        clearInterval(interval);
        setTimeout(() => {
          setShowOffers(true);
          setTimeout(() => setOffersVisible(true), 100);
        }, 1200);
      }
    }, 60);
  };

  if (step >= visibleQuestions.length) {
    if (!showScore) handleSubmit();
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background Particles */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-500/40 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CapitalyseeFr
          </div>
          <nav className="flex gap-8 items-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Accueil
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Dashboard
            </button>
          </nav>
        </header>

        {/* Results */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
          <div className="w-full max-w-4xl mx-auto">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 shadow-2xl">
              <div className={`w-full mb-10 flex flex-col items-center transition-all duration-700 ${scoreBarVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-white">Résultats de votre analyse</h2>
                  <p className="text-xl text-gray-300">Vous pouvez améliorer vos performances de</p>
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent my-4">
                    {animatedScore}%
                  </div>
                </div>
                <div className="w-full max-w-md">
                  <div className="bg-gray-800/50 rounded-full h-4 flex items-center relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(animatedScore / 11) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {showOffers && (
                <>
                  <div className={`w-full flex flex-col md:flex-row gap-8 items-center justify-center mt-0 transition-all duration-700 ${offersVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {offers.map((offer) => (
                      <div key={offer.title} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center max-w-xs w-full transition-all duration-300 hover:scale-105 hover:bg-white/10">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                          <FiCheckCircle className="text-2xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">{offer.title}</h3>
                        <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                          {offer.price}
                        </div>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                          {offer.description}
                        </p>
                        <Button
                          onClick={() => router.push('/paiement')}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
                        >
                          Choisir cette offre
                          <FiArrowRight className="ml-2 inline" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex justify-center mt-8">
                    <button
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline"
                      onClick={() => router.push('/dashboard')}
                    >
                      Accéder à mon espace
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 backdrop-blur-md bg-black/20 border-t border-white/10 py-8 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CapitalyseeFr. Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const q = visibleQuestions[step];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-500/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          CapitalyseeFr
        </div>
        <nav className="flex gap-8 items-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Accueil
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Dashboard
          </button>
        </nav>
      </header>

      {/* Question */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-2xl mx-auto">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Question {step + 1} sur {visibleQuestions.length}</span>
                <span>{Math.round(((step + 1) / visibleQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / visibleQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              setError(null);
              // Validation obligatoire
              let valid = false;
              if (q.type === 'radio') {
                valid = !!answers[q.key];
              } else if (q.type === 'number') {
                valid = answers[q.key] !== undefined && answers[q.key] !== '';
              } else if (q.type === 'checkboxes') {
                valid = Array.isArray(answers[q.key]) && answers[q.key].length > 0;
                if (q.hasOther && Array.isArray(answers[q.key]) && answers[q.key].includes('Autre')) {
                  valid = valid && !!answers[q.otherKey];
                }
              } else if (q.type === 'slider') {
                valid = answers[q.key] !== undefined && answers[q.key] !== null;
              }
              if (!valid) {
                setError('Merci de répondre à la question pour continuer.');
                return;
              }
              handleNext();
            }} className="space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">{q.label}</h2>
                
                {/* Radio Buttons */}
                {q.type === 'radio' && q.options && (
                  <div className="space-y-4">
                    {q.options.map((opt: string) => (
                      <label key={opt} className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <input
                          type="radio"
                          name={q.key}
                          value={opt}
                          checked={answers[q.key] === opt}
                          onChange={() => setAnswers((prev: any) => ({ ...prev, [q.key]: opt }))}
                          className="w-5 h-5 text-purple-500 bg-white/10 border-white/20 focus:ring-purple-500 focus:ring-2"
                        />
                        <span className="ml-3 text-white">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Number Input */}
                {q.type === 'number' && (
                  <input
                    type="number"
                    value={answers[q.key] || ''}
                    onChange={e => setAnswers((prev: any) => ({ ...prev, [q.key]: e.target.value }))}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Entrez le montant..."
                  />
                )}

                {/* Checkboxes */}
                {q.type === 'checkboxes' && q.options && (
                  <div className="space-y-4">
                    {q.options.map((opt: string) => (
                      <label key={opt} className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          name={q.key}
                          value={opt}
                          checked={Array.isArray(answers[q.key]) && answers[q.key].includes(opt)}
                          onChange={() => {
                            const arr = Array.isArray(answers[q.key]) ? answers[q.key] : [];
                            if (arr.includes(opt)) {
                              setAnswers((prev: any) => ({ ...prev, [q.key]: arr.filter((v: string) => v !== opt) }));
                            } else {
                              setAnswers((prev: any) => ({ ...prev, [q.key]: [...arr, opt] }));
                            }
                          }}
                          className="w-5 h-5 text-purple-500 bg-white/10 border-white/20 focus:ring-purple-500 focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-white">{opt}</span>
                        {q.hasOther && opt === 'Autre' && Array.isArray(answers[q.key]) && answers[q.key].includes('Autre') && (
                          <input
                            type="text"
                            className="ml-4 flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Précisez..."
                            value={answers[q.otherKey] || ''}
                            onChange={e => setAnswers((prev: any) => ({ ...prev, [q.otherKey]: e.target.value }))}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {/* Slider */}
                {q.type === 'slider' && (
                  <div className="space-y-6">
                    <input
                      type="range"
                      min={q.min}
                      max={q.max}
                      step={q.step}
                      value={answers[q.key] || 0}
                      onChange={e => setAnswers((prev: any) => ({ ...prev, [q.key]: Number(e.target.value) }))}
                      className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {answers[q.key] ?? 0} / {q.max}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Continuer
                <FiArrowRight className="ml-2 inline" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-black/20 border-t border-white/10 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CapitalyseeFr. Tous droits réservés.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
} 
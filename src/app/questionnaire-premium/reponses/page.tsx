"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Button from '../../../components/Button';
import { FiArrowLeft, FiTarget, FiTrendingUp, FiBarChart, FiShield, FiGlobe, FiCheckCircle } from 'react-icons/fi';

// Import des questions du questionnaire premium
import { quizPremiumFlow } from '../page';

export default function ReponsesPremium() {
  const router = useRouter();
  const { user } = useAuth();
  const [quizPremiumScore, setQuizPremiumScore] = useState<number | null>(null);
  const [quizPremiumAnswers, setQuizPremiumAnswers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  useEffect(() => {
    const loadData = () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      
      const userEmail = user.email;
      const score = localStorage.getItem(`quizPremiumScore_${userEmail}`);
      const answers = localStorage.getItem(`quizPremiumAnswers_${userEmail}`);
      
      if (score) {
        setQuizPremiumScore(parseInt(score));
      }
      
      if (answers) {
        setQuizPremiumAnswers(JSON.parse(answers));
      }
      
      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!quizPremiumAnswers) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12">
              <h1 className="text-3xl font-bold mb-6 text-white">Aucune réponse trouvée</h1>
              <p className="text-xl text-gray-300 mb-8">
                Vous n'avez pas encore complété le questionnaire premium.
              </p>
              <Button
                onClick={() => router.push('/questionnaire-premium')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Faire le questionnaire premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fonction pour obtenir l'icône selon la section
  const getSectionIcon = (section: string) => {
    switch (section) {
      case '🎯 Profil et stratégie':
        return <FiTarget className="text-2xl" />;
      case '💸 Patrimoine et revenus':
        return <FiTrendingUp className="text-2xl" />;
      case '⚙️ Habitudes d\'investissement':
        return <FiBarChart className="text-2xl" />;
      case '🌍 Diversification et supports':
        return <FiGlobe className="text-2xl" />;
      case '🛡️ Gestion du risque et fiscalité':
        return <FiShield className="text-2xl" />;
      case '✅ Objectifs spécifiques':
        return <FiCheckCircle className="text-2xl" />;
      default:
        return <FiTarget className="text-2xl" />;
    }
  };

  // Grouper les questions par section
  const groupedQuestions = quizPremiumFlow.reduce((acc: any, question) => {
    const section = question.label.includes('🎯') ? '🎯 Profil et stratégie' :
                   question.label.includes('💸') ? '💸 Patrimoine et revenus' :
                   question.label.includes('⚙️') ? '⚙️ Habitudes d\'investissement' :
                   question.label.includes('🌍') ? '🌍 Diversification et supports' :
                   question.label.includes('🛡️') ? '🛡️ Gestion du risque et fiscalité' :
                   question.label.includes('✅') ? '✅ Objectifs spécifiques' : 'Autres';
    
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {});

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
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-white/10 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
          >
            <FiArrowLeft className="mr-2 inline" />
            Retour au dashboard
          </Button>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Mes Réponses Premium
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Score Section */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTarget className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">Vos Réponses Premium</h1>
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-6 inline-block">
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">Score Premium : {quizPremiumScore}%</h2>
              <p className="text-gray-300">
                Basé sur vos réponses au questionnaire premium
              </p>
            </div>
          </div>

          {/* Réponses détaillées par section */}
          <div className="space-y-8">
            {Object.entries(groupedQuestions).map(([section, questions]: [string, any]) => (
              <div key={section} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {getSectionIcon(section)}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section}</h2>
                </div>
                
                <div className="space-y-6">
                  {questions.map((question: any, index: number) => {
                    const answer = quizPremiumAnswers[question.key];
                    const otherAnswer = question.otherKey ? quizPremiumAnswers[question.otherKey] : null;
                    
                    if (!answer) return null;

                    return (
                      <div key={index} className="border border-white/10 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {question.label.replace(/^[🎯💸⚙️🌍🛡️✅]\s*/, '')}
                        </h3>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-emerald-400 font-semibold">
                            {Array.isArray(answer) ? answer.join(', ') : answer}
                            {answer === "Autre" && otherAnswer && ` : ${otherAnswer}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-12 text-center">
            <Button
              onClick={() => router.push('/questionnaire-premium')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl mr-4"
            >
              Refaire le questionnaire
            </Button>
            <Button
              onClick={() => router.push('/rapport')}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Voir le rapport premium
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 
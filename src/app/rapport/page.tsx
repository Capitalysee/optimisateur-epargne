"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FiArrowLeft, FiTrendingUp, FiBarChart, FiTarget, FiDownload, FiShare2, FiEye } from 'react-icons/fi';

export default function Rapport() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>(null);
  const [quizPremiumDone, setQuizPremiumDone] = useState(false);
  const [quizPremiumScore, setQuizPremiumScore] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    // Récupérer les données du quiz depuis le localStorage avec l'email de l'utilisateur
    const userEmail = user.email;
    const quizDone = localStorage.getItem(`quizDone_${userEmail}`) === 'true';
    const quizScoreLocal = localStorage.getItem(`quizScore_${userEmail}`);
    const quizAnswersLocal = localStorage.getItem(`quizAnswers_${userEmail}`);

    if (quizDone && quizScoreLocal) {
      setQuizScore(parseInt(quizScoreLocal));
    }
    if (quizAnswersLocal) {
      setQuizAnswers(JSON.parse(quizAnswersLocal));
    }

    // Récupérer les données du quiz premium avec l'email de l'utilisateur
    const quizPremiumDoneLocal = localStorage.getItem(`quizPremiumDone_${userEmail}`) === 'true';
    const quizPremiumScoreLocal = localStorage.getItem(`quizPremiumScore_${userEmail}`);
    
    setQuizPremiumDone(quizPremiumDoneLocal);
    if (quizPremiumScoreLocal) {
      setQuizPremiumScore(parseInt(quizPremiumScoreLocal));
    }

    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!quizScore) {
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
              onClick={() => router.push('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <FiArrowLeft />
              Retour au dashboard
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiEye className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">
                Questionnaire requis
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Vous devez d'abord compléter le questionnaire d'analyse pour générer votre rapport personnalisé.
              </p>
              <button
                onClick={() => router.push('/questionnaire')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Commencer le questionnaire
              </button>
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
            onClick={() => router.push('/dashboard')}
            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            <FiArrowLeft />
            Retour au dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTrendingUp className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Votre rapport personnalisé
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Analyse complète de votre situation financière et recommandations d'optimisation personnalisées.
            </p>
          </div>

          {/* Score Section */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Score d'optimisation</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {quizScore}%
              </div>
              <div className="w-full max-w-md mx-auto">
                <div className="bg-gray-800/50 rounded-full h-4 flex items-center relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(quizScore / 11) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-300 mt-4">
                Vous pouvez améliorer vos performances de {quizScore}% en optimisant votre épargne.
              </p>
            </div>
          </div>

          {/* Score Premium Section - Only show if quiz premium is done */}
          {quizPremiumDone && quizPremiumScore && (
            <div className="backdrop-blur-md bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">Score Premium</h2>
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-4">
                  {quizPremiumScore}%
                </div>
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-gray-800/50 rounded-full h-4 flex items-center relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${quizPremiumScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 mt-4">
                  Votre profil d'investisseur premium a été analysé avec succès.
                </p>
                <div className="bg-white/5 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Prochaines étapes</h3>
                  <p className="text-white">
                    Nous vous contacterons dans <span className="font-bold text-emerald-400">24h au plus tard</span> avec un rapport détaillé fait par nos experts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Current Situation */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <FiBarChart className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Situation actuelle</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Livret A :</span>
                  <span className="text-white">{quizAnswers?.livretA || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investissement bourse :</span>
                  <span className="text-white">{quizAnswers?.bourse || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span>PEA :</span>
                  <span className="text-white">{quizAnswers?.pea || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assurance-vie :</span>
                  <span className="text-white">{quizAnswers?.assuranceVie || 'Non renseigné'}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <FiTarget className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Recommandations</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Diversifier vos placements</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Optimiser votre fiscalité</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Augmenter votre épargne mensuelle</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Considérer l'investissement immobilier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Analyse détaillée</h2>
            {quizPremiumDone ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiTarget className="text-2xl text-white" />
                </div>
                <p className="text-xl text-white mb-4">
                  Vous recevrez un mail dans les prochaines heures pour savoir quoi optimiser.
                </p>
                <p className="text-gray-300">
                  Notre équipe d'experts analyse actuellement vos réponses premium pour vous fournir des recommandations personnalisées.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Points forts</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-400 font-medium">Épargne de précaution</p>
                      <p className="text-gray-300 text-sm">Vous avez une bonne base de sécurité financière.</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-400 font-medium">Diversification</p>
                      <p className="text-gray-300 text-sm">Votre portefeuille présente une bonne diversification.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Axes d'amélioration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <p className="text-yellow-400 font-medium">Rendement</p>
                      <p className="text-gray-300 text-sm">Optimiser le rendement de vos placements.</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <p className="text-yellow-400 font-medium">Fiscalité</p>
                      <p className="text-gray-300 text-sm">Réduire l'impact fiscal de vos investissements.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/paiement')}
              className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiShare2 />
              Accompagnement expert
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-black/20 border-t border-white/10 py-8 px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CapitalyseeFr. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
} 
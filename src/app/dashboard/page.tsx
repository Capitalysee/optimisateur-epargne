"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { FiTrendingUp, FiBarChart, FiBookOpen, FiLogOut, FiUser, FiSettings, FiArrowRight, FiCheckCircle, FiClock, FiCpu, FiTarget, FiRefreshCw } from 'react-icons/fi';

export default function Dashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [userOffre, setUserOffre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizPremiumDone, setQuizPremiumDone] = useState(false);
  const [quizPremiumScore, setQuizPremiumScore] = useState<number | null>(null);
  const [quizPremiumAnswers, setQuizPremiumAnswers] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          // Tentative de récupération de l'offre utilisateur
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('offre')
            .eq('email', user.email)
            .single();

          if (fetchError) {
            console.log('Utilisateur non trouvé ou table inexistante, utilisation des valeurs par défaut');
            setUserOffre('gratuit');
          } else {
            setUserOffre(existingUser?.offre || 'gratuit');
          }

          // Vérifier si le quiz a été fait
          const userEmail = user.email;
          const quizDoneLocal = localStorage.getItem(`quizDone_${userEmail}`) === 'true';
          const quizScoreLocal = localStorage.getItem(`quizScore_${userEmail}`);
          
          setQuizDone(quizDoneLocal);
          if (quizScoreLocal) {
            setQuizScore(parseInt(quizScoreLocal));
          }

          // Vérifier si le quiz premium a été fait
          const quizPremiumDoneLocal = localStorage.getItem(`quizPremiumDone_${userEmail}`) === 'true';
          const quizPremiumScoreLocal = localStorage.getItem(`quizPremiumScore_${userEmail}`);
          const quizPremiumAnswersLocal = localStorage.getItem(`quizPremiumAnswers_${userEmail}`);
          
          setQuizPremiumDone(quizPremiumDoneLocal);
          if (quizPremiumScoreLocal) {
            setQuizPremiumScore(parseInt(quizPremiumScoreLocal));
          }
          if (quizPremiumAnswersLocal) {
            setQuizPremiumAnswers(JSON.parse(quizPremiumAnswersLocal));
          }

        } catch (error) {
          console.log('Erreur lors de la récupération des données, utilisation des valeurs par défaut');
          setUserOffre('gratuit');
        }
      }
      setLoading(false);
    };

    fetchUserData();

    // Écouter les changements du localStorage
    const handleStorageChange = () => {
      if (!user?.email) return;
      
      const userEmail = user.email;
      const quizPremiumDoneLocal = localStorage.getItem(`quizPremiumDone_${userEmail}`) === 'true';
      const quizPremiumScoreLocal = localStorage.getItem(`quizPremiumScore_${userEmail}`);
      const quizPremiumAnswersLocal = localStorage.getItem(`quizPremiumAnswers_${userEmail}`);
      
      setQuizPremiumDone(quizPremiumDoneLocal);
      if (quizPremiumScoreLocal) {
        setQuizPremiumScore(parseInt(quizPremiumScoreLocal));
      }
      if (quizPremiumAnswersLocal) {
        setQuizPremiumAnswers(JSON.parse(quizPremiumAnswersLocal));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier aussi lors du focus de la fenêtre (pour les changements dans le même onglet)
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const refreshQuizData = () => {
    if (!user?.email) return;
    
    const userEmail = user.email;
    const quizPremiumDoneLocal = localStorage.getItem(`quizPremiumDone_${userEmail}`) === 'true';
    const quizPremiumScoreLocal = localStorage.getItem(`quizPremiumScore_${userEmail}`);
    const quizPremiumAnswersLocal = localStorage.getItem(`quizPremiumAnswers_${userEmail}`);
    
    console.log('🔄 REFRESH QUIZ DATA:');
    console.log('Email:', userEmail);
    console.log('Quiz Premium Done:', quizPremiumDoneLocal);
    console.log('Quiz Premium Score:', quizPremiumScoreLocal);
    console.log('Quiz Premium Answers:', quizPremiumAnswersLocal ? 'EXISTE' : 'NEXISTE');
    
    setQuizPremiumDone(quizPremiumDoneLocal);
    if (quizPremiumScoreLocal) {
      setQuizPremiumScore(parseInt(quizPremiumScoreLocal));
    }
    if (quizPremiumAnswersLocal) {
      setQuizPremiumAnswers(JSON.parse(quizPremiumAnswersLocal));
    }
    
    console.log('État après mise à jour:');
    console.log('quizPremiumDone state:', quizPremiumDoneLocal);
  };

  // Rafraîchir les données quand l'utilisateur revient sur le dashboard
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshQuizData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Forcer la mise à jour des données au chargement de la page
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshQuizData();
    }, 1000); // Attendre 1 seconde après le chargement

    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300">
            <FiUser className="text-lg" />
            <span>{user?.email}</span>
            {userOffre === 'premium' && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Premium
              </span>
            )}
          </div>
          <button
            onClick={refreshQuizData}
            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
            title="Rafraîchir les données"
          >
            <FiRefreshCw className="text-lg" />
          </button>
          <button
            onClick={handleSignOut}
            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            <FiLogOut />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Bienvenue sur votre dashboard
            </h1>
            <p className="text-xl text-gray-300">
              Gérez votre épargne et optimisez vos investissements
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {quizScore ? `${quizScore}%` : 'N/A'}
              </h3>
              <p className="text-gray-300">Score d'optimisation</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBarChart className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {userOffre === 'premium' ? 'Premium' : 'Gratuit'}
              </h3>
              <p className="text-gray-300">Niveau d'accès</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {quizDone ? 'Complété' : 'À faire'}
              </h3>
              <p className="text-gray-300">Questionnaire</p>
            </div>
          </div>

          {/* Section Premium - Only show if user is premium */}
          {userOffre === 'premium' && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 mb-16 text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Rapport personnalisé</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Accédez à votre rapport détaillé et à vos recommandations personnalisées.
              </p>
              <Button
                onClick={() => router.push('/questionnaire-premium')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Faire le questionnaire
                <FiArrowRight className="ml-2 inline" />
              </Button>
            </div>
          )}

          {/* Projection Curve Section - Only show if quiz is done */}
          {quizDone && quizScore && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white">Votre potentiel sur 10 ans</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Basé sur votre score de {quizScore}%, voici votre projection d'épargne optimisée
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* New Chart with Correct Calculations */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-white/10">
                    <div className="relative h-96 w-full">
                      {/* Chart Container with proper margins */}
                      <div className="absolute inset-0" style={{ marginLeft: '80px', marginRight: '40px', marginTop: '40px', marginBottom: '60px' }}>
                        {/* Background Grid */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Horizontal grid lines */}
                          {[...Array(5)].map((_, i) => (
                            <line
                              key={`h-${i}`}
                              x1="0"
                              y1={20 * i}
                              x2="100"
                              y2={20 * i}
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                            />
                          ))}
                          {/* Vertical grid lines */}
                          {[...Array(11)].map((_, i) => (
                            <line
                              key={`v-${i}`}
                              x1={10 * i}
                              y1="0"
                              x2={10 * i}
                              y2="100"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                            />
                          ))}
                        </svg>

                        {/* Fixed Growth Curve (2.5% per year) - Correct compound interest */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path
                            d={`M0 100 L10 ${100 - (10 * Math.pow(1.025, 1) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L20 ${100 - (10 * Math.pow(1.025, 2) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L30 ${100 - (10 * Math.pow(1.025, 3) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L40 ${100 - (10 * Math.pow(1.025, 4) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L50 ${100 - (10 * Math.pow(1.025, 5) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L60 ${100 - (10 * Math.pow(1.025, 6) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L70 ${100 - (10 * Math.pow(1.025, 7) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L80 ${100 - (10 * Math.pow(1.025, 8) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L90 ${100 - (10 * Math.pow(1.025, 9) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L100 ${100 - (10 * Math.pow(1.025, 10) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90}`}
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-draw"
                            style={{
                              strokeDasharray: "0 1000",
                              animation: "draw 2s ease-out forwards"
                            }}
                          />
                        </svg>

                        {/* Personalized Growth Curve - Correct compound interest */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path
                            d={`M0 100 L10 ${100 - (10 * Math.pow(1 + (quizScore / 100), 1) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L20 ${100 - (10 * Math.pow(1 + (quizScore / 100), 2) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L30 ${100 - (10 * Math.pow(1 + (quizScore / 100), 3) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L40 ${100 - (10 * Math.pow(1 + (quizScore / 100), 4) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L50 ${100 - (10 * Math.pow(1 + (quizScore / 100), 5) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L60 ${100 - (10 * Math.pow(1 + (quizScore / 100), 6) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L70 ${100 - (10 * Math.pow(1 + (quizScore / 100), 7) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L80 ${100 - (10 * Math.pow(1 + (quizScore / 100), 8) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L90 ${100 - (10 * Math.pow(1 + (quizScore / 100), 9) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90} L100 ${100 - (10 * Math.pow(1 + (quizScore / 100), 10) - 10) / (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 90}`}
                            stroke="url(#growthGradient)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-draw"
                            style={{
                              strokeDasharray: "0 1000",
                              animation: "draw 2s ease-out 0.5s forwards"
                            }}
                          />
                          <defs>
                            <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="50%" stopColor="#EC4899" />
                              <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Y-axis labels with correct calculations */}
                      <div className="absolute left-0 top-0 h-full flex flex-col text-sm font-semibold text-gray-300" style={{ marginTop: '40px', marginBottom: '60px' }}>
                        <span style={{ marginBottom: '32px' }}>{Math.round(10 * Math.pow(1 + (quizScore / 100), 10))}k€</span>
                        <span style={{ marginBottom: '32px' }}>{Math.round(10 + (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 0.8)}k€</span>
                        <span style={{ marginBottom: '32px' }}>{Math.round(10 + (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 0.6)}k€</span>
                        <span style={{ marginBottom: '32px' }}>{Math.round(10 + (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 0.4)}k€</span>
                        <span style={{ marginBottom: '32px' }}>{Math.round(10 + (10 * Math.pow(1 + (quizScore / 100), 10) - 10) * 0.2)}k€</span>
                        <span>10k€</span>
                      </div>

                      {/* X-axis labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm font-semibold text-gray-300" style={{ marginLeft: '80px', marginRight: '40px' }}>
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10 ans</span>
                      </div>

                      {/* Legend */}
                      <div className="absolute top-6 right-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-white">Croissance personnalisée ({quizScore}%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-sm font-semibold text-gray-400">Croissance à 2,5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Explanation with correct calculations */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Votre impact personnalisé</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-gray-300">Avec nos stratégies : <span className="text-white font-semibold">~{Math.round(10 * Math.pow(1 + (quizScore / 100), 10))}k€</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Sans optimisation : <span className="text-white font-semibold">~{Math.round(10 * Math.pow(1.025, 10))}k€</span></span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                      <p className="text-white font-semibold text-lg mb-1">+{Math.round(10 * Math.pow(1 + (quizScore / 100), 10) - 10 * Math.pow(1.025, 10))}k€ de différence</p>
                      <p className="text-gray-300 text-sm">Basé sur votre score de {quizScore}% d'optimisation</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => userOffre === 'premium' ? router.push('/rapport') : router.push('/paiement')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
                  >
                    {userOffre === 'premium' ? 'Voir le rapport détaillé' : 'Passer premium pour voir le rapport'}
                    <FiArrowRight className="ml-2 inline" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quiz Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <FiBarChart className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Questionnaire d'analyse</h3>
              <p className="text-gray-300 mb-6">
                {quizDone 
                  ? 'Vous avez déjà complété le questionnaire. Consultez vos résultats.'
                  : 'Complétez notre questionnaire pour recevoir des recommandations personnalisées.'
                }
              </p>
              <button
                onClick={() => router.push('/questionnaire')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {quizDone ? 'Voir les résultats' : 'Commencer le quiz'}
                <FiArrowRight className="ml-2 inline" />
              </button>
            </div>

            {/* Quiz Premium Card - Only show if user is premium */}
            {userOffre === 'premium' && (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-4">
                  <FiTarget className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Questionnaire Premium</h3>
                <p className="text-gray-300 mb-6">
                  {quizPremiumDone 
                    ? `Score Premium : ${quizPremiumScore}% - Consultez vos réponses détaillées.`
                    : 'Analyse approfondie de votre profil d\'investisseur premium.'
                  }
                </p>
                <button
                  onClick={() => router.push(quizPremiumDone ? '/questionnaire-premium/reponses' : '/questionnaire-premium')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  {quizPremiumDone ? 'Consulter mes réponses' : 'Faire le questionnaire premium'}
                  <FiArrowRight className="ml-2 inline" />
                </button>
              </div>
            )}

            {/* Calculateur Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <FiCpu className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Calculateur de performance</h3>
              <p className="text-gray-300 mb-6">
                Simulez la performance réelle de vos placements bancaires français, corrigée de l'inflation depuis 2000.
              </p>
              <button
                onClick={() => router.push('/dashboard/calculateur')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Accéder au calculateur
                <FiArrowRight className="ml-2 inline" />
              </button>
            </div>

            {/* Library Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <FiBookOpen className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Bibliothèque</h3>
              <p className="text-gray-300 mb-6">
                Accédez à nos guides, tutoriels et ressources pour optimiser votre épargne.
              </p>
              <button
                onClick={() => router.push('/dashboard/bibliotheque')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Explorer
                <FiArrowRight className="ml-2 inline" />
              </button>
            </div>

            {/* Report Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <FiTrendingUp className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Rapport personnalisé</h3>
              <p className="text-gray-300 mb-6">
                {userOffre === 'premium' 
                  ? (quizPremiumDone 
                      ? 'Consultez votre rapport détaillé et vos recommandations personnalisées.'
                      : 'Accédez à votre rapport détaillé et à vos recommandations personnalisées.'
                    )
                  : 'Débloquez votre rapport personnalisé en passant à la version premium.'
                }
              </p>
              <Button
                onClick={() => {
                  if (userOffre === 'premium') {
                    if (quizPremiumDone) {
                      router.push('/rapport');
                    } else {
                      router.push('/questionnaire-premium');
                    }
                  } else {
                    router.push('/paiement');
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {userOffre === 'premium' 
                  ? (quizPremiumDone ? 'Voir le rapport détaillé' : 'Faire le questionnaire')
                  : 'Passer premium pour voir le rapport'
                }
                <FiArrowRight className="ml-2 inline" />
              </Button>
            </div>

            {/* Payment Card */}
            {userOffre !== 'premium' && (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <FiSettings className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Passer Premium</h3>
                <p className="text-gray-300 mb-6">
                  Débloquez toutes les fonctionnalités et recevez un accompagnement personnalisé.
                </p>
                <button
                  onClick={() => router.push('/paiement')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  Remplir la fiche
                  <FiArrowRight className="ml-2 inline" />
                </button>
              </div>
            )}

            {/* Support Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <FiClock className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Support</h3>
              <p className="text-gray-300 mb-6">
                Besoin d'aide ? Notre équipe est disponible pour vous accompagner.
              </p>
              <button
                onClick={() => router.push('/faq')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Contacter le support
                <FiArrowRight className="ml-2 inline" />
              </button>
            </div>
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

      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dasharray: 1000 0;
          }
        }
        .animate-draw {
          stroke-dasharray: 0 1000;
        }
      `}</style>
    </div>
  );
} 
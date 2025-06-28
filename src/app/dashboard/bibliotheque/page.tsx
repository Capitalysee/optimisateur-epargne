"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { FiArrowLeft, FiBookOpen, FiDownload, FiPlay, FiFileText, FiVideo, FiExternalLink, FiStar, FiUsers, FiClock } from 'react-icons/fi';

export default function Bibliotheque() {
  const router = useRouter();
  const { user } = useAuth();
  const [userOffre, setUserOffre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
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
        } catch (error) {
          console.log('Erreur lors de la récupération des données, utilisation des valeurs par défaut');
          setUserOffre('gratuit');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const resources = [
    {
      id: 1,
      title: "Guide de l'investisseur débutant",
      type: "PDF",
      description: "Tout ce que vous devez savoir pour commencer à investir en toute sécurité.",
      icon: FiFileText,
      color: "from-blue-500 to-cyan-500",
      downloadUrl: "/api/download/guide-investisseur",
      premium: false
    },
    {
      id: 2,
      title: "Les bases de l'épargne",
      type: "Vidéo",
      description: "Vidéo explicative sur les fondamentaux de l'épargne et de l'investissement.",
      icon: FiVideo,
      color: "from-purple-500 to-pink-500",
      downloadUrl: "#",
      premium: false
    },
    {
      id: 3,
      title: "Stratégies d'optimisation fiscale",
      type: "PDF",
      description: "Comment optimiser votre fiscalité pour maximiser vos gains.",
      icon: FiFileText,
      color: "from-green-500 to-emerald-500",
      downloadUrl: "#",
      premium: false
    },
    {
      id: 4,
      title: "Webinaire : Investir en 2024",
      type: "Vidéo",
      description: "Replay de notre webinaire sur les opportunités d'investissement en 2024.",
      icon: FiVideo,
      color: "from-yellow-500 to-orange-500",
      downloadUrl: "#",
      premium: false
    },
    {
      id: 5,
      title: "Comparatif des supports d'investissement",
      type: "PDF",
      description: "Tableau comparatif détaillé des différents supports d'investissement.",
      icon: FiFileText,
      color: "from-indigo-500 to-purple-500",
      downloadUrl: "#",
      premium: false
    },
    {
      id: 6,
      title: "Gestion du risque",
      type: "Vidéo",
      description: "Comment gérer le risque dans vos investissements et diversifier votre portefeuille.",
      icon: FiVideo,
      color: "from-red-500 to-pink-500",
      downloadUrl: "#",
      premium: false
    }
  ];

  const premiumResources = [
    {
      id: 7,
      title: "Stratégies avancées d'investissement",
      type: "PDF",
      description: "Techniques avancées pour optimiser vos rendements et minimiser les risques.",
      icon: FiFileText,
      color: "from-emerald-500 to-teal-500",
      downloadUrl: "#",
      premium: true
    },
    {
      id: 8,
      title: "Webinaire exclusif : Marchés 2024",
      type: "Vidéo",
      description: "Analyse exclusive des tendances de marché et opportunités pour 2024.",
      icon: FiVideo,
      color: "from-violet-500 to-purple-500",
      downloadUrl: "#",
      premium: true
    },
    {
      id: 9,
      title: "Guide complet de l'immobilier",
      type: "PDF",
      description: "Tout sur l'investissement immobilier : SCPI, crowdfunding, direct.",
      icon: FiFileText,
      color: "from-orange-500 to-red-500",
      downloadUrl: "#",
      premium: true
    },
    {
      id: 10,
      title: "Masterclass : Psychologie de l'investisseur",
      type: "Vidéo",
      description: "Comprendre et maîtriser la psychologie derrière les décisions d'investissement.",
      icon: FiVideo,
      color: "from-pink-500 to-rose-500",
      downloadUrl: "#",
      premium: true
    },
    {
      id: 11,
      title: "Portfolio Builder Premium",
      type: "PDF",
      description: "Outil exclusif pour construire et optimiser votre portefeuille d'investissement.",
      icon: FiFileText,
      color: "from-cyan-500 to-blue-500",
      downloadUrl: "#",
      premium: true
    },
    {
      id: 12,
      title: "Consultation privée : 1h avec un expert",
      type: "Rendez-vous",
      description: "Séance privée d'une heure avec un expert pour personnaliser votre stratégie.",
      icon: FiUsers,
      color: "from-yellow-500 to-amber-500",
      downloadUrl: "/paiement",
      premium: true
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const allResources = userOffre === 'premium' ? [...resources, ...premiumResources] : resources;

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
              <FiBookOpen className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Bibliothèque de ressources
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {userOffre === 'premium' 
                ? "Accédez à notre collection complète de guides, tutoriels vidéo et ressources exclusives pour optimiser votre épargne et vos investissements."
                : "Accédez à notre collection de guides, tutoriels vidéo et ressources pour optimiser votre épargne et vos investissements."
              }
            </p>
            {userOffre === 'premium' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <FiStar className="text-lg" />
                <span className="font-semibold">Accès Premium - Contenu exclusif disponible</span>
              </div>
            )}
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allResources.map((resource) => (
              <div
                key={resource.id}
                className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 ${
                  resource.premium ? 'ring-2 ring-green-500/50' : ''
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-full flex items-center justify-center mb-4 relative`}>
                  <resource.icon className="text-2xl text-white" />
                  {resource.premium && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <FiStar className="text-xs text-white" />
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                    <div className="flex items-center gap-2">
                      {resource.premium && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                      <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (resource.downloadUrl.startsWith('/api/')) {
                      // Pour les routes API, utiliser fetch pour déclencher le téléchargement
                      fetch(resource.downloadUrl)
                        .then(response => {
                          if (response.ok) {
                            return response.blob();
                          }
                          throw new Error('Erreur lors du téléchargement');
                        })
                        .then(blob => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = resource.title.replace(/[^a-zA-Z0-9]/g, '-') + '.pdf';
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        })
                        .catch(error => {
                          console.error('Erreur:', error);
                          alert('Erreur lors du téléchargement. Veuillez réessayer.');
                        });
                    } else if (resource.type === 'Rendez-vous') {
                      // Pour les rendez-vous, utiliser router.push pour la navigation interne
                      router.push(resource.downloadUrl);
                    } else {
                      // Pour les autres liens, ouvrir dans un nouvel onglet
                      window.open(resource.downloadUrl, '_blank');
                    }
                  }}
                  className={`w-full bg-gradient-to-r ${resource.color} text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl flex items-center justify-center gap-2`}
                >
                  {resource.type === 'Vidéo' ? (
                    <>
                      <FiPlay />
                      Regarder
                    </>
                  ) : resource.type === 'Rendez-vous' ? (
                    <>
                      <FiClock />
                      Réserver
                    </>
                  ) : (
                    <>
                      <FiDownload />
                      Télécharger
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Premium Section - Only show for non-premium users */}
          {userOffre !== 'premium' && (
            <div className="mt-16">
              <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Débloquez plus de contenu
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Passez à la version premium pour accéder à des ressources exclusives, des webinaires en direct et un accompagnement personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/paiement')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                  >
                    Passer Premium
                  </button>
                  <button
                    onClick={() => router.push('/faq')}
                    className="border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          )}
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
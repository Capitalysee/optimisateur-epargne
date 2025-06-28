"use client";
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';
import { FiSun, FiMoon, FiTrendingUp, FiShield, FiUsers, FiArrowRight, FiStar, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { user, signIn } = useAuth();
  const [supportMessage, setSupportMessage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Forcé en mode sombre
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: supportEmail, message: supportMessage }),
      });
      const data = await res.json();
      if (data.success) {
      setSupportSent(true);
      setSupportMessage('');
      setSupportEmail('');
      } else {
        alert('Erreur lors de l\'envoi du message.');
      }
    } catch (error) {
      alert('Erreur de connexion au serveur.');
    }
    setSupportLoading(false);
  };

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsLoading(true);
      try {
        await signIn();
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Erreur lors de la connexion. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLearnMore = () => {
    router.push('/faq');
  };

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
            onClick={() => router.push('/faq')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            FAQ
          </button>
          <a
            href="#support"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Support
          </a>
          {user ? (
            <>
              <span className="text-purple-400 font-medium">Bienvenue, {user.email}</span>
              <Button 
                onClick={() => router.push('/dashboard')} 
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Dashboard
              </Button>
            </>
          ) : (
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Connexion'}
            </Button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Hero Content */}
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Optimisez votre épargne
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  en toute confiance
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Un accompagnement premium, moderne et personnalisé pour faire fructifier votre épargne en toute sérénité. 
                Découvrez votre potentiel en quelques minutes.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
                <Button
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Connexion...' : 'Commencer maintenant'}
                  <FiArrowRight className="ml-2 inline" />
                </Button>
                <Button
                  onClick={handleLearnMore}
                  className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200"
                >
                  En savoir plus
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <FiUsers className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Accompagnement humain</h3>
                <p className="text-gray-300 leading-relaxed">
                  Des experts à votre écoute pour des conseils personnalisés, loin des solutions standardisées.
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <FiShield className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Confidentialité & sécurité</h3>
                <p className="text-gray-300 leading-relaxed">
                  Vos données sont protégées et utilisées uniquement pour optimiser votre épargne.
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <FiTrendingUp className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Performance optimisée</h3>
                <p className="text-gray-300 leading-relaxed">
                  Stratégies d'investissement modernes pour maximiser vos rendements en toute sécurité.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center text-white">Pourquoi nous choisir ?</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-gray-300">Satisfaction client</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-400 mb-2">+8%</div>
                  <div className="text-gray-300">Rendement moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                  <div className="text-gray-300">Support disponible</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                  <div className="text-gray-300">Sécurisé</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">Support premium</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Notre équipe d'experts est là pour vous accompagner à chaque étape de votre parcours d'investissement.
              </p>
            </div>

            {supportSent ? (
              <div className="backdrop-blur-md bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                <div className="text-green-400 font-semibold text-lg mb-2">
                  <FiCheck className="inline mr-2" />
                  Message envoyé avec succès
                </div>
                <p className="text-gray-300">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12">
                <form onSubmit={handleSupport} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Votre email"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={supportEmail}
                      onChange={e => setSupportEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      placeholder="Votre message..."
                      rows={5}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      value={supportMessage}
                      onChange={e => setSupportMessage(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={supportLoading} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {supportLoading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-black/20 border-t border-white/10 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            CapitalyseeFr
          </div>
          <p className="text-gray-400 mb-6">
            Optimisez votre épargne avec des stratégies modernes et sécurisées
          </p>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CapitalyseeFr. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

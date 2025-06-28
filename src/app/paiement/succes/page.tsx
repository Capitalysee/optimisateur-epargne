"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiDownload, FiArrowRight, FiMail } from 'react-icons/fi';

export default function PaiementSucces() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/dashboard');
    }
  }, [countdown, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 shadow-2xl">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <FiCheckCircle className="text-4xl text-white" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold mb-6 text-white">
              Paiement réussi !
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Merci pour votre confiance. Votre rapport personnalisé est en cours de génération.
            </p>

            {/* Next Steps */}
            <div className="space-y-6 mb-12">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Prochaines étapes</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Email de confirmation</p>
                      <p className="text-gray-400 text-sm">Vous recevrez un email avec les détails de votre commande</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Rapport personnalisé</p>
                      <p className="text-gray-400 text-sm">Votre rapport sera disponible dans votre espace personnel</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Accompagnement</p>
                      <p className="text-gray-400 text-sm">Si vous avez choisi l'accompagnement, nous vous contacterons sous 24h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Accéder à mon espace
                <FiArrowRight className="ml-2 inline" />
              </button>
              
              <div className="text-sm text-gray-400">
                Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-center text-gray-400">
                <FiMail className="mr-2" />
                <span>support@capitalyseefr.com</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Une question ? Notre équipe est là pour vous aider.
              </p>
            </div>
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
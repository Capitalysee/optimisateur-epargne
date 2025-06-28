"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCreditCard, FiLock, FiShield, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function Paiement() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState('rapport');
  const [loading, setLoading] = useState(false);

  const offers = [
    {
      id: 'rapport',
      title: 'Plan détaillé personnalisé',
      price: '49,99€',
      description: 'Recevez immédiatement un rapport complet et personnalisé sur votre épargne.',
      features: [
        'Analyse complète de votre situation',
        'Recommandations personnalisées',
        'Stratégies d\'optimisation',
        'Comparatif des solutions',
        'Rapport PDF téléchargeable'
      ]
    },
    {
      id: 'accompagnement',
      title: 'Rapport + Accompagnement expert',
      price: '139,95€',
      description: 'Rapport détaillé + session personnalisée avec un expert pour optimiser votre épargne.',
      features: [
        'Tout du rapport détaillé',
        'Session de 45 min avec un expert',
        'Plan d\'action personnalisé',
        'Suivi pendant 30 jours',
        'Support prioritaire'
      ]
    }
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: selectedOffer,
          userEmail: 'anselme.drugeon@gmail.com' // Email de l'utilisateur connecté
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création de la session de paiement.');
        setLoading(false);
      }
    } catch (error) {
      alert('Erreur lors de la connexion au serveur de paiement.');
      setLoading(false);
    }
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
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCreditCard className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Choisissez votre formule
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Sélectionnez l'offre qui correspond le mieux à vos besoins et commencez à optimiser votre épargne dès aujourd'hui.
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`backdrop-blur-md border rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                  selectedOffer === offer.id
                    ? 'bg-white/10 border-purple-500/50 shadow-2xl scale-105'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                }`}
                onClick={() => setSelectedOffer(offer.id)}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">{offer.title}</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {offer.price}
                  </div>
                  <p className="text-gray-300">{offer.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {offer.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <FiCheck className="text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {selectedOffer === offer.id && (
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiCheck className="text-white text-sm" />
                    </div>
                    <span className="text-purple-400 text-sm font-medium">Sélectionné</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Payment Section */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Récapitulatif de commande</h2>
              <p className="text-gray-300">
                Vous allez être redirigé vers une page de paiement sécurisée Stripe pour finaliser votre achat.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Order Summary */}
              <div className="bg-white/5 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Formule sélectionnée</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Formule</span>
                    <span className="text-white font-medium">
                      {offers.find(o => o.id === selectedOffer)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prix</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {offers.find(o => o.id === selectedOffer)?.price}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {offers.find(o => o.id === selectedOffer)?.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <FiLock className="mr-2" />
                    Paiement sécurisé SSL
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <FiShield className="mr-2" />
                    Données protégées
                  </div>
                </div>

                {/* Payment Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Traitement en cours...
                      </div>
                    ) : (
                      <>
                        Payer {offers.find(o => o.id === selectedOffer)?.price}
                        <FiArrowRight className="ml-2 inline" />
                      </>
                    )}
                  </button>
                </div>
              </div>
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
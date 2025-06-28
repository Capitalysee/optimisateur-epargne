"use client";
import React, { useState } from 'react';
import FAQ from '../../components/FAQ';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiHelpCircle } from 'react-icons/fi';

export default function FAQPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "Comment fonctionne l'optimisation d'épargne ?",
      answer: "Notre système analyse votre situation financière actuelle à travers un questionnaire personnalisé, puis génère des recommandations adaptées à vos objectifs et votre profil de risque."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons des protocoles de sécurité de niveau bancaire et vos données sont chiffrées. Nous ne partageons jamais vos informations personnelles."
    },
    {
      question: "Combien coûte le service ?",
      answer: "Nous proposons différents niveaux de service, du rapport gratuit au coaching personnalisé. Les tarifs sont transparents et sans engagement."
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires. Votre accès reste actif jusqu'à la fin de la période payée."
    },
    {
      question: "Les recommandations sont-elles personnalisées ?",
      answer: "Chaque recommandation est générée spécifiquement pour votre situation, en tenant compte de vos objectifs, de votre âge, de votre profil de risque et de votre situation financière actuelle."
    },
    {
      question: "Que se passe-t-il après l'inscription ?",
      answer: "Après votre inscription, vous accédez immédiatement à votre espace personnel où vous pouvez compléter le questionnaire et recevoir vos premières recommandations."
    },
    {
      question: "Proposez-vous un accompagnement humain ?",
      answer: "Oui, nos formules premium incluent un accompagnement personnalisé avec des experts en investissement pour vous guider dans vos décisions."
    },
    {
      question: "Comment sont calculés les scores d'optimisation ?",
      answer: "Nos algorithmes analysent plusieurs facteurs : diversification, rendement potentiel, niveau de risque, fiscalité et coûts pour calculer un score d'optimisation global."
    }
  ];

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
            onClick={() => router.push('/inscription')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Connexion
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHelpCircle className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur notre service d'optimisation d'épargne.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left bg-white/5 hover:bg-white/10 transition-all duration-200 flex justify-between items-center"
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  >
                    <span className="font-semibold text-white">{item.question}</span>
                    <span className={`text-purple-400 transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {activeIndex === index && (
                    <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                      <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Vous ne trouvez pas votre réponse ?
              </h2>
              <p className="text-gray-300 mb-6">
                Notre équipe est là pour vous aider. Contactez-nous directement.
              </p>
              <button
                onClick={() => router.push('/#support')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Nous contacter
              </button>
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
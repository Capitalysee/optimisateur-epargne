"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiPlus, FiTrash2, FiTrendingUp, FiBarChart, FiCpu } from 'react-icons/fi';
import Button from '@/components/Button';

// Données historiques réelles (rendements annuels en %)
const placementData = {
  'Livret A': {
    name: 'Livret A',
    description: 'Livret d\'épargne réglementé',
    rates: {
      2000: 3.5, 2001: 3.5, 2002: 3.5, 2003: 3.5, 2004: 3.5, 2005: 3.5,
      2006: 3.5, 2007: 3.5, 2008: 3.5, 2009: 1.25, 2010: 1.25, 2011: 1.25,
      2012: 1.25, 2013: 1.25, 2014: 1.25, 2015: 1.25, 2016: 1.25, 2017: 1.25,
      2018: 1.25, 2019: 1.25, 2020: 1.25, 2021: 1.25, 2022: 1.25, 2023: 3.0, 2024: 3.0
    }
  },
  'LDDS': {
    name: 'LDDS',
    description: 'Livret de Développement Durable et Solidaire',
    rates: {
      2000: 3.5, 2001: 3.5, 2002: 3.5, 2003: 3.5, 2004: 3.5, 2005: 3.5,
      2006: 3.5, 2007: 3.5, 2008: 3.5, 2009: 1.25, 2010: 1.25, 2011: 1.25,
      2012: 1.25, 2013: 1.25, 2014: 1.25, 2015: 1.25, 2016: 1.25, 2017: 1.25,
      2018: 1.25, 2019: 1.25, 2020: 1.25, 2021: 1.25, 2022: 1.25, 2023: 3.0, 2024: 3.0
    }
  },
  'Livret Jeune': {
    name: 'Livret Jeune',
    description: 'Livret réservé aux 12-25 ans',
    rates: {
      2000: 4.5, 2001: 4.5, 2002: 4.5, 2003: 4.5, 2004: 4.5, 2005: 4.5,
      2006: 4.5, 2007: 4.5, 2008: 4.5, 2009: 2.5, 2010: 2.5, 2011: 2.5,
      2012: 2.5, 2013: 2.5, 2014: 2.5, 2015: 2.5, 2016: 2.5, 2017: 2.5,
      2018: 2.5, 2019: 2.5, 2020: 2.5, 2021: 2.5, 2022: 2.5, 2023: 3.5, 2024: 3.5
    }
  },
  'LEP': {
    name: 'LEP',
    description: 'Livret d\'Épargne Populaire',
    rates: {
      2000: 4.5, 2001: 4.5, 2002: 4.5, 2003: 4.5, 2004: 4.5, 2005: 4.5,
      2006: 4.5, 2007: 4.5, 2008: 4.5, 2009: 2.5, 2010: 2.5, 2011: 2.5,
      2012: 2.5, 2013: 2.5, 2014: 2.5, 2015: 2.5, 2016: 2.5, 2017: 2.5,
      2018: 2.5, 2019: 2.5, 2020: 2.5, 2021: 2.5, 2022: 2.5, 2023: 6.0, 2024: 6.0
    }
  },
  'PEL': {
    name: 'PEL',
    description: 'Plan Épargne Logement',
    rates: {
      2000: 4.5, 2001: 4.5, 2002: 4.5, 2003: 4.5, 2004: 4.5, 2005: 4.5,
      2006: 4.5, 2007: 4.5, 2008: 4.5, 2009: 2.5, 2010: 2.5, 2011: 2.5,
      2012: 2.5, 2013: 2.5, 2014: 2.5, 2015: 2.5, 2016: 2.5, 2017: 2.5,
      2018: 2.5, 2019: 2.5, 2020: 2.5, 2021: 2.5, 2022: 2.5, 2023: 2.5, 2024: 2.5
    }
  },
  'CEL': {
    name: 'CEL',
    description: 'Compte Épargne Logement',
    rates: {
      2000: 3.5, 2001: 3.5, 2002: 3.5, 2003: 3.5, 2004: 3.5, 2005: 3.5,
      2006: 3.5, 2007: 3.5, 2008: 3.5, 2009: 1.25, 2010: 1.25, 2011: 1.25,
      2012: 1.25, 2013: 1.25, 2014: 1.25, 2015: 1.25, 2016: 1.25, 2017: 1.25,
      2018: 1.25, 2019: 1.25, 2020: 1.25, 2021: 1.25, 2022: 1.25, 2023: 1.25, 2024: 1.25
    }
  },
  // S&P 500 - Données réelles (rendements annuels)
  'S&P 500': {
    name: 'S&P 500',
    description: 'Indice boursier US',
    rates: {
      2000: -9.1, 2001: -11.9, 2002: -22.1, 2003: 28.7, 2004: 10.9, 2005: 4.9,
      2006: 15.8, 2007: 5.5, 2008: -37.0, 2009: 26.5, 2010: 15.1, 2011: 2.1,
      2012: 16.0, 2013: 32.4, 2014: 13.7, 2015: 1.4, 2016: 12.0, 2017: 21.8,
      2018: -4.4, 2019: 31.5, 2020: 18.4, 2021: 28.7, 2022: -18.1, 2023: 24.2, 2024: 10.0
    }
  },
  // CAC 40 - Données réelles françaises
  'CAC 40': {
    name: 'CAC 40',
    description: 'Indice boursier FR',
    rates: {
      2000: -0.9, 2001: -22.0, 2002: -33.8, 2003: 16.1, 2004: 7.4, 2005: 23.4,
      2006: 17.5, 2007: 1.3, 2008: -42.7, 2009: 22.3, 2010: -3.3, 2011: -16.9,
      2012: 15.2, 2013: 18.0, 2014: -0.5, 2015: 8.5, 2016: 4.9, 2017: 9.3,
      2018: -11.0, 2019: 26.4, 2020: -7.1, 2021: 28.9, 2022: -9.5, 2023: 16.5, 2024: 7.0
    }
  },
  // Bitcoin - Données réelles (très volatil mais globalement positif)
  'Bitcoin': {
    name: 'Bitcoin',
    description: 'BTC',
    rates: {
      2011: 1468, 2012: 186, 2013: 5500, 2014: -56, 2015: 35, 2016: 120,
      2017: 1330, 2018: -73, 2019: 95, 2020: 305, 2021: 60, 2022: -65,
      2023: 155, 2024: 10
    }
  },
  // Or - Données réelles
  'Or': {
    name: 'Or',
    description: 'Gold',
    rates: {
      2000: -6.3, 2001: 1.4, 2002: 24.8, 2003: 19.5, 2004: 5.5, 2005: 17.1,
      2006: 23.9, 2007: 31.6, 2008: 5.8, 2009: 24.3, 2010: 29.5, 2011: 10.1,
      2012: 7.1, 2013: -28.0, 2014: 1.7, 2015: -10.4, 2016: 8.6, 2017: 13.1,
      2018: -1.6, 2019: 18.3, 2020: 25.1, 2021: -3.6, 2022: 0.4, 2023: 13.1, 2024: 8.0
    }
  },
  // Autres placements (à compléter avec des données réelles)
  'Nasdaq 100': {
    name: 'Nasdaq 100',
    description: 'Indice tech US',
    rates: {
      2000: -36.8, 2001: -31.5, 2002: -38.0, 2003: 49.2, 2004: 10.5, 2005: 1.4,
      2006: 7.0, 2007: 19.1, 2008: -41.9, 2009: 53.5, 2010: 19.2, 2011: 3.4,
      2012: 18.1, 2013: 36.6, 2014: 17.9, 2015: 9.5, 2016: 7.5, 2017: 31.5,
      2018: -1.0, 2019: 38.0, 2020: 48.0, 2021: 27.5, 2022: -32.5, 2023: 54.0, 2024: 15.0
    }
  },
  'MSCI World': {
    name: 'MSCI World',
    description: 'Indice mondial',
    rates: {
      2000: -13.8, 2001: -17.6, 2002: -20.1, 2003: 33.1, 2004: 14.7, 2005: 9.5,
      2006: 20.1, 2007: 9.2, 2008: -40.7, 2009: 30.8, 2010: 12.3, 2011: -5.5,
      2012: 16.8, 2013: 27.0, 2014: 5.5, 2015: 0.4, 2016: 8.2, 2017: 22.4,
      2018: -8.7, 2019: 26.6, 2020: 16.3, 2021: 22.4, 2022: -18.4, 2023: 22.8, 2024: 8.5
    }
  },
  'ETF Monde': {
    name: 'ETF Monde',
    description: 'ETF Monde',
    rates: {
      2000: -13.8, 2001: -17.6, 2002: -20.1, 2003: 33.1, 2004: 14.7, 2005: 9.5,
      2006: 20.1, 2007: 9.2, 2008: -40.7, 2009: 30.8, 2010: 12.3, 2011: -5.5,
      2012: 16.8, 2013: 27.0, 2014: 5.5, 2015: 0.4, 2016: 8.2, 2017: 22.4,
      2018: -8.7, 2019: 26.6, 2020: 16.3, 2021: 22.4, 2022: -18.4, 2023: 22.8, 2024: 8.5
    }
  },
  'Ethereum': {
    name: 'Ethereum',
    description: 'ETH',
    rates: {
      2016: 0, 2017: 9162, 2018: -82, 2019: -1, 2020: 469, 2021: 399,
      2022: -67, 2023: 96, 2024: 15
    }
  },
  'SCPI': {
    name: 'SCPI',
    description: 'Pierre-papier',
    rates: {
      2000: 8.5, 2001: 8.2, 2002: 7.8, 2003: 7.5, 2004: 7.2, 2005: 7.0,
      2006: 6.8, 2007: 6.5, 2008: 6.2, 2009: 5.8, 2010: 5.5, 2011: 5.2,
      2012: 5.0, 2013: 4.8, 2014: 4.5, 2015: 4.2, 2016: 4.0, 2017: 3.8,
      2018: 3.5, 2019: 3.2, 2020: 3.0, 2021: 2.8, 2022: 2.5, 2023: 2.2, 2024: 2.0
    }
  },
  'Immobilier Paris': {
    name: 'Immobilier Paris',
    description: 'Immo Paris',
    rates: {
      2000: 12.5, 2001: 11.8, 2002: 10.2, 2003: 8.5, 2004: 7.2, 2005: 6.8,
      2006: 6.2, 2007: 5.8, 2008: 4.5, 2009: 3.2, 2010: 2.8, 2011: 2.5,
      2012: 2.2, 2013: 2.0, 2014: 1.8, 2015: 1.5, 2016: 1.2, 2017: 1.0,
      2018: 0.8, 2019: 0.5, 2020: 0.2, 2021: 0.0, 2022: -0.5, 2023: -1.0, 2024: -1.5
    }
  },
  'Immobilier Province': {
    name: 'Immobilier Province',
    description: 'Immo Province',
    rates: {
      2000: 8.5, 2001: 7.8, 2002: 6.5, 2003: 5.2, 2004: 4.8, 2005: 4.5,
      2006: 4.2, 2007: 3.8, 2008: 3.2, 2009: 2.5, 2010: 2.2, 2011: 2.0,
      2012: 1.8, 2013: 1.5, 2014: 1.2, 2015: 1.0, 2016: 0.8, 2017: 0.5,
      2018: 0.2, 2019: 0.0, 2020: -0.2, 2021: -0.5, 2022: -1.0, 2023: -1.5, 2024: -2.0
    }
  },
  'Placement libre': {
    name: 'Placement libre',
    description: 'Personnalisé',
    rates: {}
  }
};

// Données d'inflation simplifiées
const inflationData = {
  2000: 1.8, 2001: 1.8, 2002: 1.9, 2003: 2.1, 2004: 2.3, 2005: 1.9,
  2006: 1.6, 2007: 1.5, 2008: 2.8, 2009: 0.1, 2010: 1.5, 2011: 2.1,
  2012: 2.0, 2013: 0.9, 2014: 0.5, 2015: 0.0, 2016: 0.2, 2017: 1.0,
  2018: 1.8, 2019: 1.1, 2020: 0.5, 2021: 2.8, 2022: 5.2, 2023: 4.9, 2024: 2.5
};

interface Placement {
  id: string;
  type: string;
  montant: number;
  annee: number;
  nom?: string;
  rendement?: number;
}

interface Resultat {
  capitalInitial: number;
  capitalFinal: number;
  performance: number;
  cagr: number;
  evolution: { annee: number; capital: number }[];
}

// Fonction pour créer une courbe lissée
const createSmoothCurve = (points: { annee: number; capital: number }[]) => {
  if (points.length < 2) return '';
  
  const maxCapital = Math.max(...points.map(p => p.capital));
  const minCapital = Math.min(...points.map(p => p.capital));
  
  const pathData = points.map((point, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - ((point.capital - minCapital) / (maxCapital - minCapital + 1e-6)) * 100;
    return `${x},${y}`;
  });
  
  // Créer une courbe lissée avec des courbes de Bézier
  let path = `M ${pathData[0]}`;
  
  for (let i = 1; i < pathData.length; i++) {
    const [x1, y1] = pathData[i - 1].split(',').map(Number);
    const [x2, y2] = pathData[i].split(',').map(Number);
    
    // Point de contrôle pour une courbe lissée
    const cp1x = x1 + (x2 - x1) * 0.5;
    const cp1y = y1;
    const cp2x = x2 - (x2 - x1) * 0.5;
    const cp2y = y2;
    
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
  }
  
  return path;
};

export default function Calculateur() {
  const router = useRouter();
  const [placements, setPlacements] = useState<Placement[]>([
    { id: '1', type: 'Livret A', montant: 5000, annee: 2015 }
  ]);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [loading, setLoading] = useState(false);

  // Générer les années disponibles
  const annees = Array.from({ length: 25 }, (_, i) => 2000 + i);

  const ajouterPlacement = () => {
    const newId = (placements.length + 1).toString();
    setPlacements([
      ...placements,
      { id: newId, type: 'Livret A', montant: 1000, annee: 2020 }
    ]);
  };

  const supprimerPlacement = (id: string) => {
    if (placements.length > 1) {
      setPlacements(placements.filter(p => p.id !== id));
    }
  };

  const modifierPlacement = (id: string, field: keyof Placement, value: any) => {
    setPlacements(placements.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculerPerformance = () => {
    setLoading(true);
    
    // Simulation de calcul
    setTimeout(() => {
      let capitalInitialTotal = 0;
      let capitalFinalTotal = 0;
      const evolution: { annee: number; capital: number }[] = [];

      // Calculer pour chaque placement
      placements.forEach(placement => {
        if (placement.type === 'Placement libre') {
          let capitalActuel = placement.montant;
          for (let annee = placement.annee; annee <= 2024; annee++) {
            const tauxBrut = placement.rendement || 0;
            const inflation = inflationData[annee as keyof typeof inflationData] || 0;
            const tauxReel = ((1 + tauxBrut / 100) / (1 + inflation / 100)) - 1;
            capitalActuel *= (1 + tauxReel);
          }
          capitalInitialTotal += placement.montant;
          capitalFinalTotal += capitalActuel;
          return;
        }
        const placementInfo = placementData[placement.type as keyof typeof placementData];
        if (!placementInfo) return;
        let capitalActuel = placement.montant;
        for (let annee = placement.annee; annee <= 2024; annee++) {
          const tauxBrut = placementInfo.rates[annee as keyof typeof placementInfo.rates] || 0;
          const inflation = inflationData[annee as keyof typeof inflationData] || 0;
          const tauxReel = ((1 + tauxBrut / 100) / (1 + inflation / 100)) - 1;
          capitalActuel *= (1 + tauxReel);
        }
        capitalInitialTotal += placement.montant;
        capitalFinalTotal += capitalActuel;
      });

      // Calculer l'évolution globale
      for (let annee = Math.min(...placements.map(p => p.annee)); annee <= 2024; annee++) {
        let capitalAnnee = 0;
        
        placements.forEach(placement => {
          if (annee >= placement.annee) {
            const placementInfo = placementData[placement.type as keyof typeof placementData];
            if (!placementInfo) return;

            let capitalPlacement = placement.montant;
            for (let a = placement.annee; a <= annee; a++) {
              const tauxBrut = placementInfo.rates[a as keyof typeof placementInfo.rates] || 0;
              const inflation = inflationData[a as keyof typeof inflationData] || 0;
              const tauxReel = ((1 + tauxBrut / 100) / (1 + inflation / 100)) - 1;
              capitalPlacement *= (1 + tauxReel);
            }
            capitalAnnee += capitalPlacement;
          }
        });

        evolution.push({ annee, capital: capitalAnnee });
      }

      const performance = ((capitalFinalTotal - capitalInitialTotal) / capitalInitialTotal) * 100;
      const nbAnnees = 2024 - Math.min(...placements.map(p => p.annee)) + 1;
      const cagr = Math.pow(capitalFinalTotal / capitalInitialTotal, 1 / nbAnnees) - 1;

      setResultat({
        capitalInitial: capitalInitialTotal,
        capitalFinal: capitalFinalTotal,
        performance,
        cagr: cagr * 100,
        evolution
      });

      setLoading(false);
    }, 1000);
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
              <FiCpu className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Calculateur de performance
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simulez la performance réelle de vos placements bancaires français, corrigée de l'inflation depuis l'an 2000.
            </p>
          </div>

          {/* Calculator Form */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Vos placements</h2>
            
            <div className="space-y-4 mb-6">
              {placements.map((placement) => (
                <div key={placement.id} className="grid md:grid-cols-4 gap-4 items-center p-4 bg-white/5 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Montant investi</label>
                    <input
                      type="number"
                      value={placement.montant}
                      onChange={(e) => modifierPlacement(placement.id, 'montant', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Année d'investissement</label>
                    <select
                      value={placement.annee}
                      onChange={(e) => modifierPlacement(placement.id, 'annee', parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {annees.map(annee => (
                        <option key={annee} value={annee}>{annee}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type de placement</label>
                    <select
                      value={placement.type}
                      onChange={(e) => modifierPlacement(placement.id, 'type', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {Object.keys(placementData).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  {placement.type === 'Placement libre' && (
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nom du placement</label>
                      <input
                        type="text"
                        value={placement.nom || ''}
                        onChange={(e) => modifierPlacement(placement.id, 'nom', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex : Entreprise perso, Crypto X..."
                      />
                      <label className="block text-sm font-medium text-gray-300 mb-2 mt-2">Rendement annuel moyen (%)</label>
                      <input
                        type="number"
                        value={placement.rendement || ''}
                        onChange={(e) => modifierPlacement(placement.id, 'rendement', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="5.8"
                      />
                    </div>
                  )}
                  <div className="flex items-end">
                    {placements.length > 1 && (
                      <button
                        onClick={() => supprimerPlacement(placement.id)}
                        className="w-full bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiTrash2 />
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={ajouterPlacement}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl flex items-center gap-2"
              >
                <FiPlus />
                Ajouter un placement
              </button>
              
              <Button
                onClick={calculerPerformance}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Calcul en cours...
                  </>
                ) : (
                  <>
                    <FiTrendingUp />
                    Calculer la performance
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results */}
          {resultat && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Résultats de votre simulation</h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {resultat.capitalInitial.toLocaleString('fr-FR')}€
                  </div>
                  <div className="text-gray-300">Capital initial</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {resultat.capitalFinal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
                  </div>
                  <div className="text-gray-300">Capital final (net d'inflation)</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">
                    {resultat.performance > 0 ? '+' : ''}{resultat.performance.toFixed(1)}%
                  </div>
                  <div className="text-gray-300">Performance totale</div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {resultat.cagr > 0 ? '+' : ''}{resultat.cagr.toFixed(2)}%/an
                </div>
                <div className="text-gray-300">Rendement annuel moyen (CAGR réel)</div>
              </div>

              {/* Graphique haute résolution sans pixelisation */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Évolution du capital</h3>
                <div className="h-[500px] relative">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
                    {/* Grille de fond */}
                    <defs>
                      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Cadre du graphique */}
                    <rect
                      x="180"
                      y="60"
                      width="960"
                      height="480"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="3"
                    />
                    
                    {/* Axe Y (vertical) */}
                    <line
                      x1="180"
                      y1="60"
                      x2="180"
                      y2="540"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3"
                    />
                    
                    {/* Axe X (horizontal) */}
                    <line
                      x1="180"
                      y1="540"
                      x2="1140"
                      y2="540"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3"
                    />
                    
                    {/* Graduations Y avec espacement amélioré */}
                    {(() => {
                      const capitalMax = Math.max(...resultat.evolution.map(p => p.capital));
                      const capitalMin = Math.min(...resultat.evolution.map(p => p.capital));
                      const range = capitalMax - capitalMin;
                      const step = range / 6;
                      
                      return Array.from({length: 7}, (_, i) => {
                        const value = capitalMin + (step * i);
                        const y = 540 - ((value - capitalMin) / range) * 480;
                        
                        return (
                          <g key={i}>
                            <line
                              x1="165"
                              y1={y}
                              x2="180"
                              y2={y}
                              stroke="rgba(255,255,255,0.15)"
                              strokeWidth="3"
                            />
                            <text
                              x="150"
                              y={y + 8}
                              textAnchor="end"
                              fill="rgba(255,255,255,0.6)"
                              fontSize="18"
                              fontFamily="Arial, sans-serif"
                              fontWeight="500"
                            >
                              {Math.round(value).toLocaleString('fr-FR')}€
                            </text>
                          </g>
                        );
                      });
                    })()}
                    
                    {/* Graduations X avec espacement élargi */}
                    {resultat.evolution.map((point, i) => {
                      if (i % Math.ceil(resultat.evolution.length / 8) === 0 || i === resultat.evolution.length - 1) {
                        const x = 180 + (i / (resultat.evolution.length - 1)) * 960;
                        
                        return (
                          <g key={point.annee}>
                            <line
                              x1={x}
                              y1="540"
                              x2={x}
                              y2="555"
                              stroke="rgba(255,255,255,0.15)"
                              strokeWidth="3"
                            />
                            <text
                              x={x}
                              y="575"
                              textAnchor="middle"
                              fill="rgba(255,255,255,0.6)"
                              fontSize="18"
                              fontFamily="Arial, sans-serif"
                              fontWeight="500"
                            >
                              {point.annee}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Courbe d'évolution fluide et lissée */}
                    {resultat.evolution.length > 1 && (
                      <path
                        fill="none"
                        stroke="url(#evoGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={(() => {
                          const capitalMax = Math.max(...resultat.evolution.map(p => p.capital));
                          const capitalMin = Math.min(...resultat.evolution.map(p => p.capital));
                          const range = capitalMax - capitalMin;
                          
                          let pathData = '';
                          resultat.evolution.forEach((point, i) => {
                            const x = 180 + (i / (resultat.evolution.length - 1)) * 960;
                            const y = 540 - ((point.capital - capitalMin) / (range + 1e-6)) * 480;
                            
                            if (i === 0) {
                              pathData += `M ${x} ${y}`;
                            } else {
                              // Courbe de Bézier pour plus de fluidité
                              const prevPoint = resultat.evolution[i - 1];
                              const prevX = 180 + ((i - 1) / (resultat.evolution.length - 1)) * 960;
                              const prevY = 540 - ((prevPoint.capital - capitalMin) / (range + 1e-6)) * 480;
                              
                              const cp1x = prevX + (x - prevX) * 0.5;
                              const cp1y = prevY;
                              const cp2x = x - (x - prevX) * 0.5;
                              const cp2y = y;
                              
                              pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`;
                            }
                          });
                          return pathData;
                        })()}
                      />
                    )}
                    
                    {/* Points de données clairement visibles */}
                    {resultat.evolution.map((point, i) => {
                      const x = 180 + (i / (resultat.evolution.length - 1)) * 960;
                      const capitalMax = Math.max(...resultat.evolution.map(p => p.capital));
                      const capitalMin = Math.min(...resultat.evolution.map(p => p.capital));
                      const range = capitalMax - capitalMin;
                      const y = 540 - ((point.capital - capitalMin) / (range + 1e-6)) * 480;
                      
                      return (
                        <circle
                          key={point.annee}
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#EC4899"
                          stroke="white"
                          strokeWidth="3"
                        />
                      );
                    })}
                    
                    <defs>
                      <linearGradient id="evoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
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

      <style jsx global>{`
        select, select option {
          color: #fff !important;
          background: #1a1a1a !important;
        }
      `}</style>
    </div>
  );
} 
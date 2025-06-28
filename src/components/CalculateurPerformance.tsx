import React, { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Taux bruts annuels (exemples, à ajuster)
const tauxPlacements: Record<string, number[]> = {
  'Livret A': [2.5, 3, 2.8, 2.5, 2.25, 2, 2, 1.75, 1.5, 1.25, 1, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.5, 0.5, 0.75, 0.5, 0.5, 0.5, 0.5],
  'LDDS': [2.5, 3, 2.8, 2.5, 2.25, 2, 2, 1.75, 1.5, 1.25, 1, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.5, 0.5, 0.75, 0.5, 0.5, 0.5, 0.5],
  'Livret Jeune': [3, 3, 3, 3, 3, 2.75, 2.5, 2.25, 2, 2, 1.75, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.25, 1.25, 1.5, 1.25, 1.25, 1.25, 1.25],
  'LEP': [4, 4, 4, 4, 4, 3.5, 3, 2.75, 2.5, 2.25, 2, 1.75, 1.75, 1.75, 1.75, 1.75, 1.75, 1.75, 1.5, 1.5, 2, 1.5, 1.5, 1.5, 1.5],
  'CEL': [2.25, 2.25, 2.25, 2, 2, 2, 2, 1.75, 1.5, 1.25, 1, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.5, 0.5, 0.75, 0.5, 0.5, 0.5, 0.5],
  'PEL': [4.5, 4.5, 4.5, 4, 3.5, 3, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2, 2, 2, 1.5, 1, 1, 1],
  'Assurance-vie fonds euros': [4.5, 4.3, 4, 3.8, 3.5, 3.2, 3, 2.8, 2.5, 2.3, 2, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1, 1, 1, 1, 1, 1],
  'Compte à terme': [3, 3, 3, 2.8, 2.5, 2.2, 2, 1.8, 1.5, 1.3, 1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.7, 0.7, 0.8, 0.7, 0.7, 0.7, 0.7],
  'PER': [4, 4, 4, 3.8, 3.5, 3.2, 3, 2.8, 2.5, 2.3, 2, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1, 1, 1, 1, 1, 1],
};
// Taux d'inflation INSEE 2000-2024 (exemples, à ajuster)
const inflation = [1.7, 1.6, 1.9, 2.1, 2.1, 1.8, 1.6, 1.5, 2.8, 0.1, 1.5, 2.1, 2, 0.9, 0.5, 0, 0.2, 1, 1.8, 0.5, 0.5, 1.1, 1.6, 5.2, 4.9];
const ANNEES = Array.from({ length: 25 }, (_, i) => 2000 + i);
const PLACEMENTS = Object.keys(tauxPlacements);

function cagr(finalValue: number, initialValue: number, years: number) {
  return Math.pow(finalValue / initialValue, 1 / years) - 1;
}

const CalculateurPerformance: React.FC = () => {
  const [placements, setPlacements] = useState([
    { montant: 10000, annee: 2010, type: PLACEMENTS[0] },
  ]);
  const [resultat, setResultat] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [pieData, setPieData] = useState<any>(null);

  const isDark = typeof window !== 'undefined' ? document.body.classList.contains('theme-dark') : false;
  const chartTextColor = isDark ? '#fff' : 'var(--foreground)';
  const cagrColor = isDark ? '#fff' : 'var(--secondary)';
  const gridColor = isDark ? 'rgba(200,200,200,0.1)' : '#E5E7EB';

  const handleChange = (idx: number, field: string, value: any) => {
    setPlacements(pls => pls.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const handleAdd = () => {
    setPlacements(pls => [...pls, { montant: 1000, annee: 2015, type: PLACEMENTS[0] }]);
  };
  const handleRemove = (idx: number) => {
    setPlacements(pls => pls.length > 1 ? pls.filter((_, i) => i !== idx) : pls);
  };

  const handleCalcul = () => {
    // Calcul de l'évolution de chaque placement
    let maxYears = 0;
    const evolutions = placements.map(({ montant, annee, type }) => {
      const startIdx = annee - 2000;
      const tauxs = tauxPlacements[type].slice(startIdx);
      const infls = inflation.slice(startIdx);
      let capital = montant;
      const evolution = [capital];
      for (let i = 0; i < tauxs.length; i++) {
        const tauxBrut = tauxs[i] / 100;
        const infl = infls[i] / 100;
        const tauxReel = ((1 + tauxBrut) / (1 + infl)) - 1;
        capital = capital * (1 + tauxReel);
        evolution.push(Math.round(capital));
      }
      if (tauxs.length > maxYears) maxYears = tauxs.length;
      return { evolution, montant, annee, type, final: capital };
    });
    // Agrégation année par année
    const minYear = Math.min(...placements.map(p => p.annee));
    const years = Array.from({ length: maxYears + 1 }, (_, i) => minYear + i);
    const totalEvolution = years.map((_, i) =>
      evolutions.reduce((sum, evo) => {
        const idx = i - (evo.annee - minYear);
        return sum + (idx >= 0 && idx < evo.evolution.length ? evo.evolution[idx] : 0);
      }, 0)
    );
    const totalInitial = placements.reduce((sum, p) => sum + p.montant, 0);
    const totalFinal = totalEvolution[totalEvolution.length - 1];
    const perf = ((totalFinal - totalInitial) / totalInitial) * 100;
    const nbAnnees = years.length - 1;
    const cagrVal = cagr(totalFinal, totalInitial, nbAnnees);
    setResultat({ final: Math.round(totalFinal), perf, cagr: cagrVal, nbAnnees });
    setGraphData({
      labels: years,
      datasets: [
        {
          label: 'Portefeuille total',
          data: totalEvolution,
          borderColor: '#bda613',
          backgroundColor: 'rgba(189,166,19,0.15)',
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    });
    setPieData({
      labels: placements.map((p, i) => `${p.type} (${p.annee})`),
      datasets: [
        {
          data: evolutions.map(e => Math.round(e.final)),
          backgroundColor: [
            '#bda613', '#B7C9A8', '#ffb347', '#23395d', '#BFD7ED', '#e53e3e', '#34507a', '#F6E7B2', '#B7C9A8', '#bda613'
          ],
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Calculateur de performance (placements bancaires)</h2>
      <form className="flex flex-col gap-4 items-center w-full justify-center" onSubmit={e => { e.preventDefault(); handleCalcul(); }}>
        {placements.map((p, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-2 items-center w-full max-w-2xl">
            <input
              type="number"
              min={1}
              value={p.montant}
              onChange={e => handleChange(idx, 'montant', Number(e.target.value))}
              className="rounded-xl border px-4 py-2 w-32 text-lg font-semibold text-center"
              style={{ background: 'var(--card-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
              placeholder="Montant (€)"
            />
            <select
              value={p.annee}
              onChange={e => handleChange(idx, 'annee', Number(e.target.value))}
              className="rounded-xl border px-4 py-2 w-32 text-lg font-semibold text-center"
              style={{ background: 'var(--card-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
            >
              {ANNEES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select
              value={p.type}
              onChange={e => handleChange(idx, 'type', e.target.value)}
              className="rounded-xl border px-4 py-2 text-lg font-semibold text-center"
              style={{ background: 'var(--card-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
            >
              {PLACEMENTS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
            </select>
            <button type="button" onClick={() => handleRemove(idx)} className="px-3 py-2 rounded-xl font-bold text-lg transition-all" style={{ background: 'var(--danger)', color: '#fff' }}>Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={handleAdd} className="px-6 py-2 rounded-2xl font-bold text-lg shadow-sm transition-all" style={{ background: 'var(--secondary)', color: '#fff' }}>+ Ajouter un placement</button>
        <button type="submit" className="px-6 py-2 rounded-2xl font-bold text-lg shadow-sm transition-all" style={{ background: 'var(--primary)', color: 'var(--foreground)' }}>Calculer</button>
      </form>
      {resultat && (
        <div className="w-full max-w-xl bg-[var(--card-bg)] rounded-2xl shadow-md p-6 border border-[var(--card-border)] flex flex-col items-center mt-4">
          <div className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Résultat global du portefeuille :</div>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-4">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Capital final total : {resultat.final} €</div>
            <div className="text-lg font-semibold" style={{ color: resultat.perf >= 0 ? 'var(--primary)' : 'var(--danger)' }}>Performance nette cumulée : {resultat.perf >= 0 ? '+' : ''}{resultat.perf.toFixed(1)}%</div>
            <div className="text-lg font-semibold" style={{ color: cagrColor }}>CAGR global : {(resultat.cagr * 100).toFixed(2)}%/an</div>
          </div>
          {graphData && (
            <div className="w-full max-w-lg mx-auto mt-4">
              <Line data={graphData} options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: chartTextColor } },
                  title: { display: true, text: 'Évolution du portefeuille', color: chartTextColor },
                },
                scales: {
                  x: { ticks: { color: chartTextColor }, grid: { color: gridColor } },
                  y: { ticks: { color: chartTextColor }, grid: { color: gridColor } },
                },
              }} height={180} />
            </div>
          )}
          {pieData && (
            <div className="w-full max-w-xs mx-auto mt-8">
              <Doughnut data={pieData} options={{
                plugins: {
                  legend: { labels: { color: chartTextColor, font: { size: 14 } } },
                  title: { display: true, text: 'Répartition finale par placement', color: chartTextColor },
                },
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculateurPerformance; 
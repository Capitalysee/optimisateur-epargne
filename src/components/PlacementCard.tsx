import React from 'react';

type PlacementCardProps = {
  nom: string;
  definition: string;
  fonctionnement: string;
  rendement: string;
  fiscalite: string;
  avantages: string[];
  inconvenients: string[];
  inflation: string;
  cible: string;
  onClickEnSavoirPlus?: () => void;
};

const PlacementCard: React.FC<PlacementCardProps> = ({
  nom, definition, fonctionnement, rendement, fiscalite, avantages, inconvenients, inflation, cible, onClickEnSavoirPlus
}) => (
  <div className="rounded-xl border shadow-md p-6 mb-6 bg-[var(--card-bg)]">
    <h2 className="text-xl font-bold mb-2">{nom}</h2>
    <p><strong>Définition :</strong> {definition}</p>
    <p><strong>Fonctionnement :</strong> {fonctionnement}</p>
    <p><strong>Rendement :</strong> {rendement}</p>
    <p><strong>Fiscalité :</strong> {fiscalite}</p>
    <p><strong>Avantages :</strong></p>
    <ul className="list-disc ml-6">{avantages.map((a, i) => <li key={i}>{a}</li>)}</ul>
    <p><strong>Inconvénients :</strong></p>
    <ul className="list-disc ml-6">{inconvenients.map((i, j) => <li key={j}>{i}</li>)}</ul>
    <p><strong>Protection contre l'inflation ?</strong> {inflation}</p>
    <p><strong>À qui s'adresse ce produit ?</strong> {cible}</p>
    {onClickEnSavoirPlus && (
      <button onClick={onClickEnSavoirPlus} className="mt-4 px-4 py-2 rounded bg-[var(--primary)] text-white font-semibold">
        🔍 En savoir plus
      </button>
    )}
  </div>
);

export default PlacementCard; 
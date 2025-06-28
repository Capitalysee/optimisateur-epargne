import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Button from './Button';

interface OfferCardProps {
  title: string;
  price: string;
  description: string;
  onPay: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ title, price, description, onPay }) => {
  const handlePayment = async () => {
    try {
      // Récupérer les données utilisateur du localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userPhone = localStorage.getItem('userPhone');
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerTitle: title,
          price: price,
          userEmail: userEmail,
          userName: userName,
          userPhone: userPhone
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      // Fallback vers l'ancienne méthode
      onPay();
    }
  };

  return (
    <div className="rounded-3xl shadow-xl p-8 flex flex-col items-center text-center max-w-xs w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <FiCheckCircle className="text-[var(--accent)] text-4xl mb-4" />
      <h3 className="text-2xl font-bold mb-2 font-sans leading-tight" style={{ color: 'var(--foreground)' }}>{title}</h3>
      <div className="text-3xl font-extrabold mb-3" style={{ color: 'var(--accent)' }}>{price}</div>
      <p className="mb-6 font-sans text-base leading-relaxed" style={{ color: 'var(--foreground)' }}>{description}</p>
      <Button onClick={handlePayment} className="w-full py-3 rounded-2xl font-bold text-lg shadow-md hover:bg-[var(--primary-hover)] hover:text-[var(--foreground)] transition-all" style={{ background: 'var(--primary)', color: 'var(--foreground)' }}>Choisir cette offre</Button>
    </div>
  );
};

export default OfferCard; 
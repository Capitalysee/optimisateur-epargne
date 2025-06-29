import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseNotification } from '../../../lib/emailService';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId, offerTitle, price, userEmail, userName, userPhone } = await req.json();
  
  // Définir les offres (doit correspondre à celles du front)
  const offers: Record<'rapport' | 'accompagnement', { name: string; price: number }> = {
    rapport: {
      name: 'Plan détaillé personnalisé',
      price: 4999, // en centimes d'euros
    },
    accompagnement: {
      name: 'Rapport + Accompagnement expert',
      price: 21500, // 215€ en centimes d'euros
    },
  };

  const offer = offers[priceId as 'rapport' | 'accompagnement'];
  if (!offer) {
    return NextResponse.json({ error: 'Offre invalide' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: offer.name,
            },
            unit_amount: offer.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/paiement/succes',
      cancel_url: 'http://localhost:3000/paiement',
      metadata: {
        userEmail: userEmail,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création de la session Stripe' }, { status: 500 });
  }
} 
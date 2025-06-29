import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseNotification } from '../../../lib/emailService';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId, userEmail } = await req.json();

  const prices = {
    rapport: {
      name: 'Plan détaillé personnalisé',
      price: 4999, // 49,99€ en centimes d'euros
    },
    accompagnement: {
      name: 'Rapport + Accompagnement expert',
      price: 21500, // 215€ en centimes d'euros
    },
  };

  const selectedPrice = prices[priceId as keyof typeof prices];
  if (!selectedPrice) {
    return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: selectedPrice.name,
            },
            unit_amount: selectedPrice.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/paiement`,
      metadata: {
        userEmail: userEmail,
        offerType: priceId
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { email, message } = await request.json();

  // Configurer le transporteur Gmail avec le mot de passe fourni
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'capitalyseefr@gmail.com',
      pass: 'qooo tpko ilsj nwos',
    },
  });

  const mailOptions = {
    from: email,
    to: 'capitalyseefr@gmail.com',
    subject: 'Nouveau message support premium',
    html: `<p><strong>Email de l'utilisateur :</strong> ${email}</p><p><strong>Message :</strong><br/>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'envoi de l\'email.' }, { status: 500 });
  }
} 
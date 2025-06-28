import nodemailer from 'nodemailer';

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre service
  auth: {
    user: process.env.EMAIL_USER, // ton email Gmail
    pass: process.env.EMAIL_PASS, // mot de passe d'application Gmail
  },
});

// Vérifier la configuration
console.log('Configuration email:', {
  user: process.env.EMAIL_USER,
  adminEmail: process.env.ADMIN_EMAIL,
  hasPass: !!process.env.EMAIL_PASS
});

// Email de notification d'inscription
export async function sendInscriptionNotification(userData: {
  email: string;
  nom?: string;
  telephone?: string;
}) {
  console.log('Tentative d\'envoi email inscription pour:', userData.email);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // email admin pour recevoir les notifications
    subject: '🆕 Nouvelle inscription - Optimisateur Épargne',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #bda613;">Nouvelle inscription sur Optimisateur Épargne</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations de l'utilisateur :</h3>
          <p><strong>Email :</strong> ${userData.email}</p>
          ${userData.nom ? `<p><strong>Nom :</strong> ${userData.nom}</p>` : ''}
          ${userData.telephone ? `<p><strong>Téléphone :</strong> ${userData.telephone}</p>` : ''}
          <p><strong>Date d'inscription :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        <p style="color: #666;">Cet utilisateur vient de s'inscrire sur votre plateforme d'optimisation d'épargne.</p>
      </div>
    `,
  };

  try {
    console.log('Envoi email à:', mailOptions.to);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de notification d\'inscription envoyé avec succès:', result.messageId);
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email d\'inscription:', error);
    if (error instanceof Error) {
      console.error('Code d\'erreur:', (error as any).code);
      console.error('Message d\'erreur:', error.message);
    }
  }
}

// Email de notification de réponse au quiz
export async function sendQuizNotification(userData: {
  email: string;
  nom?: string;
}, quizAnswers: any, score: number) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: '📊 Nouvelle réponse au quiz - Optimisateur Épargne',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #bda613;">Nouvelle réponse au quiz</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations de l'utilisateur :</h3>
          <p><strong>Email :</strong> ${userData.email}</p>
          ${userData.nom ? `<p><strong>Nom :</strong> ${userData.nom}</p>` : ''}
          <p><strong>Score obtenu :</strong> ${score}%</p>
          <p><strong>Date de réponse :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Récapitulatif des réponses :</h3>
          <ul style="list-style: none; padding: 0;">
            ${Object.entries(quizAnswers).map(([key, value]) => `
              <li style="margin-bottom: 10px; padding: 10px; background-color: white; border-radius: 4px;">
                <strong>${key} :</strong> ${Array.isArray(value) ? value.join(', ') : value}
              </li>
            `).join('')}
          </ul>
        </div>
        
        <p style="color: #666;">Cet utilisateur a complété le questionnaire d'optimisation d'épargne.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de notification de quiz envoyé');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de quiz:', error);
  }
}

// Email de notification d'achat
export async function sendPurchaseNotification(userData: {
  email: string;
  nom?: string;
  telephone?: string;
}, purchaseData: {
  offerTitle: string;
  price: string;
  paymentMethod?: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: '💰 Nouvel achat - Optimisateur Épargne',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #bda613;">Nouvel achat effectué !</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations de l'acheteur :</h3>
          <p><strong>Email :</strong> ${userData.email}</p>
          ${userData.nom ? `<p><strong>Nom :</strong> ${userData.nom}</p>` : ''}
          ${userData.telephone ? `<p><strong>Téléphone :</strong> ${userData.telephone}</p>` : ''}
          <p><strong>Date d'achat :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Détails de l'achat :</h3>
          <p><strong>Offre :</strong> ${purchaseData.offerTitle}</p>
          <p><strong>Prix :</strong> ${purchaseData.price}</p>
          ${purchaseData.paymentMethod ? `<p><strong>Méthode de paiement :</strong> ${purchaseData.paymentMethod}</p>` : ''}
        </div>
        
        <p style="color: #666;">Un nouvel achat a été effectué sur votre plateforme !</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de notification d\'achat envoyé');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'achat:', error);
  }
}

// Email de confirmation d'inscription pour l'utilisateur
export async function sendWelcomeEmail(userData: {
  email: string;
  nom?: string;
}) {
  console.log('Tentative d\'envoi email de bienvenue à:', userData.email);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userData.email,
    subject: 'Bienvenue sur Optimisateur Épargne !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #bda613;">Bienvenue sur Optimisateur Épargne !</h2>
        <p>Bonjour ${userData.nom || 'cher utilisateur'},</p>
        <p>Merci de vous être inscrit sur notre plateforme d'optimisation d'épargne.</p>
        <p>Nous sommes ravis de vous accompagner dans votre parcours d'investissement.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Prochaines étapes :</h3>
          <ul>
            <li>Complétez notre questionnaire personnalisé</li>
            <li>Découvrez vos recommandations d'optimisation</li>
            <li>Accédez à notre bibliothèque éducative</li>
          </ul>
        </div>
        <p>À très bientôt !</p>
        <p>L'équipe Optimisateur Épargne</p>
      </div>
    `,
  };

  try {
    console.log('Envoi email de bienvenue à:', mailOptions.to);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de bienvenue envoyé avec succès:', result.messageId);
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email de bienvenue:', error);
    if (error instanceof Error) {
      console.error('Code d\'erreur:', (error as any).code);
      console.error('Message d\'erreur:', error.message);
    }
  }
}
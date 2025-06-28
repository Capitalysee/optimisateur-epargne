# Configuration des Emails Automatiques

## Prérequis

1. **Compte Gmail** avec authentification à 2 facteurs activée
2. **Mot de passe d'application** Gmail (pas le mot de passe principal)

## Configuration

### 1. Créer un mot de passe d'application Gmail

1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Sécurité → Connexion à Google → Mots de passe d'application
3. Sélectionnez "Autre (nom personnalisé)" et nommez-le "Optimisateur Épargne"
4. Copiez le mot de passe généré (16 caractères)

### 2. Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Configuration des emails
EMAIL_USER=ton-email@gmail.com
EMAIL_PASS=ton-mot-de-passe-application-16-caracteres
ADMIN_EMAIL=admin@optimisateur-epargne.com

# Configuration Stripe (optionnel)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Emails envoyés automatiquement

#### 📧 Inscription
- **À l'admin** : Notification avec email, nom, téléphone de l'utilisateur
- **À l'utilisateur** : Email de bienvenue avec les prochaines étapes

#### 📊 Quiz complété
- **À l'admin** : Récapitulatif complet des réponses + score obtenu

#### 💰 Achat effectué
- **À l'admin** : Détails de l'achat (offre, prix, informations acheteur)

## Test

1. Redémarrez le serveur de développement
2. Testez l'inscription avec un vrai email
3. Vérifiez que vous recevez les emails de notification

## Dépannage

### Erreur "Invalid login"
- Vérifiez que l'authentification à 2 facteurs est activée
- Utilisez un mot de passe d'application, pas le mot de passe principal

### Erreur "Less secure app access"
- Les mots de passe d'application sont plus sécurisés que l'accès "moins sécurisé"

### Emails non reçus
- Vérifiez le dossier spam
- Vérifiez les variables d'environnement
- Consultez les logs du serveur

## Sécurité

- Ne committez jamais le fichier `.env.local`
- Utilisez des mots de passe d'application, pas le mot de passe principal
- En production, utilisez un service d'email dédié (SendGrid, Mailgun, etc.) 
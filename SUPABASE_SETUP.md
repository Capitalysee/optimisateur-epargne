# Configuration Supabase

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé API

## 2. Variables d'environnement

Créez un fichier `.env.local` avec :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

## 3. Configuration de la base de données

Exécutez le script SQL dans `create_users_table.sql` dans l'éditeur SQL de Supabase.

**Important :** Ce script crée automatiquement un trigger qui ajoute les nouveaux utilisateurs à la table `users` quand ils s'inscrivent via l'authentification Supabase.

## 4. Migration des utilisateurs existants

Si vous avez déjà des utilisateurs inscrits, exécutez le script `migrate_existing_users.sql` dans l'éditeur SQL de Supabase pour les ajouter à la table `users`.

## 5. Configuration de l'authentification

1. Dans Supabase Dashboard > Authentication > Settings
2. Configurez les URLs de redirection :
   - `http://localhost:3000/auth/callback`
   - `https://votre-domaine.com/auth/callback`

## 6. Configuration des emails

1. Dans Supabase Dashboard > Authentication > Email Templates
2. Personnalisez les templates d'email selon vos besoins

## 7. Test de connexion

Utilisez l'endpoint `/api/test-supabase` pour tester la connexion.

## 8. Vérification du fonctionnement

1. Créez un nouveau compte via l'inscription
2. Vérifiez que l'utilisateur apparaît dans :
   - Authentication > Users (table auth.users)
   - Table Editor > users (votre table personnalisée)
3. Testez l'achat premium pour vérifier que l'offre passe bien à "premium" 
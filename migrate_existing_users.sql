-- Script pour migrer les utilisateurs existants de auth.users vers la table users
-- À exécuter dans l'éditeur SQL de Supabase

-- Insérer tous les utilisateurs de auth.users qui ne sont pas encore dans la table users
INSERT INTO users (email, offre, created_at)
SELECT 
  au.email,
  'gratuit' as offre,
  au.created_at
FROM auth.users au
LEFT JOIN users u ON au.email = u.email
WHERE u.email IS NULL
  AND au.email IS NOT NULL
  AND au.email_confirmed_at IS NOT NULL; -- Seulement les utilisateurs qui ont confirmé leur email

-- Afficher le nombre d'utilisateurs migrés
SELECT 
  COUNT(*) as utilisateurs_migres
FROM auth.users au
LEFT JOIN users u ON au.email = u.email
WHERE u.email IS NULL
  AND au.email IS NOT NULL
  AND au.email_confirmed_at IS NOT NULL; 
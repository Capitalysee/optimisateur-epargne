-- Créer la table users dans Supabase
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  offre TEXT DEFAULT 'gratuit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer l'utilisateur actuel s'il n'existe pas
INSERT INTO users (email, offre) 
VALUES ('anselme.drugeon@gmail.com', 'gratuit')
ON CONFLICT (email) DO NOTHING;

-- Créer la table pour les réponses du questionnaire premium
CREATE TABLE IF NOT EXISTS quiz_premium_responses (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- Créer un index sur l'email pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_quiz_premium_email ON quiz_premium_responses(email);

-- Fonction pour créer automatiquement un utilisateur dans la table users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (email, offre)
  VALUES (NEW.email, 'gratuit')
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour exécuter la fonction quand un nouvel utilisateur s'inscrit
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 
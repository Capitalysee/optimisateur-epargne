"use client";
import React, { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import { FiSun, FiMoon, FiArrowRight, FiMail, FiLock, FiPhone, FiUser } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export default function Inscription() {
  const [mode, setMode] = useState<'inscription' | 'connexion'>('inscription');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [signupMessage, setSignupMessage] = useState('');
  const [signinMessage, setSigninMessage] = useState('');

  const validateEmail = (email: string) => /.+@.+\..+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('SESSION ACTUELLE:', session);
    });
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMessage('');
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      setSignupMessage(error.message);
    } else {
      setSignupMessage('Vérifie ta boîte mail pour confirmer ton inscription !');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setSigninMessage(error.message);
    } else {
      setSigninMessage('Connexion réussie !');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-500/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          CapitalyseeFr
        </div>
        <nav className="flex gap-8 items-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Accueil
          </button>
          <button
            onClick={() => router.push('/faq')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            FAQ
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              type="button" 
              onClick={() => {
                setMode('inscription');
                setSignupMessage('');
                setSigninMessage('');
                setError('');
                setSuccess('');
              }} 
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                mode === 'inscription' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl' 
                  : 'border border-white/20 text-white hover:bg-white/10'
              }`}
            >
              Inscription
            </button>
            <button 
              type="button" 
              onClick={() => {
                setMode('connexion');
                setSignupMessage('');
                setSigninMessage('');
                setError('');
                setSuccess('');
              }} 
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                mode === 'connexion' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl' 
                  : 'border border-white/20 text-white hover:bg-white/10'
              }`}
            >
              Connexion
            </button>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-white">
              {mode === 'inscription' ? 'Créer mon compte' : 'Se connecter'}
            </h1>

            <form onSubmit={mode === 'inscription' ? handleSignUp : handleSignIn} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiMail className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Name Field (Inscription only) */}
              {mode === 'inscription' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FiUser className="inline mr-2" />
                    Nom (optionnel)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Votre nom"
                  />
                </div>
              )}

              {/* Phone Field (Inscription only) */}
              {mode === 'inscription' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FiPhone className="inline mr-2" />
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Votre téléphone"
                  />
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiLock className="inline mr-2" />
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Error Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Success Messages */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm">
                  {success}
                </div>
              )}

              {/* Signup/Signin Messages */}
              {mode === 'inscription' && signupMessage && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-purple-400 text-sm">
                  {signupMessage}
                </div>
              )}
              {mode === 'connexion' && signinMessage && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm">
                  {signinMessage}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi...' : mode === 'inscription' ? 'Créer mon compte' : 'Se connecter'}
                <FiArrowRight className="ml-2 inline" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-black/20 border-t border-white/10 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CapitalyseeFr. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
} 
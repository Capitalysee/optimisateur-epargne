'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Vérification en cours...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erreur lors de la vérification:', error)
          setMessage('Erreur lors de la vérification. Veuillez réessayer.')
          setTimeout(() => router.push('/connexion'), 3000)
          return
        }

        if (data.session) {
          // S'assurer que l'utilisateur est dans la table users
          if (data.session.user?.email) {
            const { error: userError } = await supabase
              .from('users')
              .insert([{ email: data.session.user.email, offre: 'gratuit' }])
              .select();
            
            if (userError && userError.code !== '23505') { // Ignorer l'erreur de doublon
              console.error('Erreur lors de l\'ajout à la table users:', userError);
            }
          }
          
          setMessage('Compte confirmé avec succès ! Redirection vers le quiz...')
          setTimeout(() => router.push('/questionnaire'), 2000)
        } else {
          setMessage('Vérification terminée. Vous pouvez maintenant vous connecter.')
          setTimeout(() => router.push('/connexion'), 3000)
        }
      } catch (error) {
        console.error('Erreur:', error)
        setMessage('Une erreur est survenue. Redirection...')
        setTimeout(() => router.push('/connexion'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Confirmation du compte
          </h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chargement...
            </h2>
            <p className="text-gray-600">Vérification en cours...</p>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 
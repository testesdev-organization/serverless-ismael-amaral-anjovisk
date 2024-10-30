'use client'

import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignInCognitoButton (): React.ReactNode {
  return (
    <button
      className="flex px-4 py-2 w-full justify-center rounded-md bg-fuchsia-700 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-fuchsia-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
      onClick={() => {
        signIn('cognito', { redirectTo: '/u/home' })
          .then()
          .catch((error) => {
            console.error(error)
          })
      }}
    >
      Entrar
    </button>
  )
}

export function SignOutCognitoButton (): React.ReactNode {
  const router = useRouter()
  const logoutUrl = `${process.env.NEXT_PUBLIC_AUTH_COGNITO_DOMAIN}/logout?client_id=${process.env.NEXT_PUBLIC_AUTH_COGNITO_ID}&logout_uri=${process.env.NEXT_PUBLIC_BASE_URL}/logout&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/login&response_type=code`
  return (
    <button
      className="flex px-4 py-2 w-full justify-center rounded-md bg-red-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-70       0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      onClick={() => {
        signOut({
          redirect: false
        })
          .then(() => {
            router.push(logoutUrl)
          })
          .catch((error) => {
            console.error(error)
          })
      }}
    >
      Sair
    </button>
  )
}

export function CopyIdTokenToClipboardButton (): React.ReactNode {
  const session = useSession()
  return (
    <button
      className="flex px-4 py-2 w-full justify-center rounded-md bg-green-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-70       0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      onClick={() => {
        navigator.clipboard.writeText((session.data as unknown as { idToken: string })?.['idToken'] ?? '')
      }}
    >
      Copy jwt to clipboard
    </button>
  )
}

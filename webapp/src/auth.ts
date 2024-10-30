import NextAuth from 'next-auth'
import cognito from 'next-auth/providers/cognito'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [cognito],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'cognito') {
        return { ...token, idToken: account.id_token }
      }
      return token
    },
    async session({ session, token }) {
      return { ...session, idToken: token.idToken }
    }
  },
  trustHost: true
})

// src/auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import connectMongoDB from './libs/mongodb'
import User from './models/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      // API_URL이 없을 때를 대비해서 NEXTAUTH_URL 또는 localhost로 보완
      const apiUrl =
        process.env.API_URL ||
        process.env.NEXTAUTH_URL ||
        'http://localhost:3000'

      const { name, email } = user

      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // 몽고DB 연결 후, 기존 유저 여부 확인
          await connectMongoDB()
          const userExists = await User.findOne({ email })

          // ───────── 새 유저일 때만 /api/user 호출해서 저장 ─────────
          if (!userExists) {
            const res = await fetch(`${apiUrl}/api/user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, email }),
            })

            if (!res.ok) {
              console.error('Failed to register user')
              return false
            }
          }

          // ───────── 로그인 로그 남기기 (/api/log) ─────────
          // 실패하더라도 로그인 자체는 막지 않음
          try {
            await fetch(`${apiUrl}/api/log`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            })
          } catch (logError) {
            console.error('Failed to log login event:', logError)
          }

          return true
        } catch (error) {
          console.log(error)
          return false
        }
      }

      return true
    },
  },
})

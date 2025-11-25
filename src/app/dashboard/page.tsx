import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard 대시보드</h1>
      <pre className="mt-4">{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

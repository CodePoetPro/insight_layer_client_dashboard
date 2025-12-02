'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, userApi } from '@/lib/api/mock'
import type { User } from '@/lib/api/types'

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, company?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser()
      if (currentUser) {
        const { user: fullUser } = await userApi.getMe()
        setUser(fullUser)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const { user } = await authApi.login({ email, password })
    setUser(user)
    if (!user.onboarded) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  }

  const signup = async (name: string, email: string, password: string, company?: string) => {
    const { user } = await authApi.signup({ name, email, password, company })
    setUser(user)
    router.push('/onboarding')
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    router.push('/login')
  }

  const refreshUser = async () => {
    const { user: fullUser } = await userApi.getMe()
    setUser(fullUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


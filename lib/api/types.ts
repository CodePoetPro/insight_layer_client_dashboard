export type Plan = {
  id: string
  name: string
  aiCredits: number
  humanInsightCredits: number
  price: number
}

export type User = {
  id: string
  email: string
  name: string
  company?: string
  role?: string
  timezone?: string
  planId: string
  onboarded: boolean
  useCases?: string[]
  audience?: string[]
  createdAt: string
}

export type ResearchRequest = {
  id: string
  userId: string
  title: string
  coreQuestion: string
  context?: string
  outputType: string
  targetAudience: string
  depth: string
  timeHorizon: string
  subquestions: string[]
  insightMode: 'ai-only' | 'ai-plus-human'
  status: 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export type InsightBrief = {
  id: string
  requestId: string
  userId: string
  title: string
  mode: 'ai-only' | 'ai-plus-human'
  status: 'draft' | 'generating' | 'completed' | 'needs-review'
  shareSlug?: string
  isShareable: boolean
  sections: BriefSection[]
  humanInsightSections?: BriefSection[]
  createdAt: string
  updatedAt: string
}

export type BriefSection = {
  key: string
  title: string
  content: string
}

export type HumanReviewJob = {
  id: string
  briefId: string
  briefTitle: string
  status: 'pending' | 'in-progress' | 'completed'
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export type Notification = {
  id: string
  userId: string
  type: 'brief-completed' | 'review-assigned' | 'credit-low' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type SignupPayload = {
  name: string
  email: string
  password: string
  company?: string
}

export type ProfileUpdatePayload = {
  name?: string
  company?: string
  role?: string
  timezone?: string
}

export type OnboardingPayload = {
  name: string
  company?: string
  role: string
  timezone: string
  useCases: string[]
  audience: string[]
}

export type CreateRequestPayload = {
  title: string
  coreQuestion: string
  context?: string
  outputType: string
  targetAudience: string
  depth: string
  timeHorizon: string
  subquestions: string[]
  insightMode: 'ai-only' | 'ai-plus-human'
}

export type RegenerateSectionPayload = {
  briefId: string
  sectionKey: string
  extraInstructions?: string
}

export type HumanInsightPayload = {
  briefId: string
  sections: Array<{
    key: string
    content: string
  }>
}


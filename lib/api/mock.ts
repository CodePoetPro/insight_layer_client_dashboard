import type {
  User,
  Plan,
  ResearchRequest,
  InsightBrief,
  HumanReviewJob,
  Notification,
  AuthResponse,
  LoginCredentials,
  SignupPayload,
  ProfileUpdatePayload,
  OnboardingPayload,
  CreateRequestPayload,
  RegenerateSectionPayload,
  HumanInsightPayload,
} from './types'

// Mock data storage
let mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    company: 'Acme Corp',
    role: 'Founder',
    timezone: 'America/New_York',
    planId: 'pro',
    onboarded: true,
    useCases: ['Market analysis', 'Strategy briefs'],
    audience: ['Executive team', 'Investors'],
    createdAt: new Date().toISOString(),
  },
]

let mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    aiCredits: 5,
    humanInsightCredits: 0,
    price: 0,
  },
  {
    id: 'pro',
    name: 'Pro',
    aiCredits: 50,
    humanInsightCredits: 10,
    price: 99,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    aiCredits: 500,
    humanInsightCredits: 100,
    price: 999,
  },
]

let mockRequests: ResearchRequest[] = []
let mockBriefs: InsightBrief[] = []
let mockJobs: HumanReviewJob[] = []
let mockNotifications: Notification[] = []

let currentUserId: string | null = null
let currentAnalystId: string | null = null

// Auth APIs
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = mockUsers.find((u) => u.email === credentials.email)
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials')
    }
    currentUserId = user.id
    return {
      user,
      token: 'mock-token-' + user.id,
    }
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: payload.email,
      name: payload.name,
      company: payload.company,
      planId: 'free',
      onboarded: false,
      createdAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    currentUserId = newUser.id
    return {
      user: newUser,
      token: 'mock-token-' + newUser.id,
    }
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    currentUserId = null
    currentAnalystId = null
  },

  getCurrentUser: async (): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (!currentUserId) return null
    return mockUsers.find((u) => u.id === currentUserId) || null
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Simulate success
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Simulate success
  },
}

// User/Profile APIs
export const userApi = {
  getMe: async (): Promise<{ user: User; plan: Plan }> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!currentUserId) throw new Error('Not authenticated')
    const user = mockUsers.find((u) => u.id === currentUserId)!
    const plan = mockPlans.find((p) => p.id === user.planId)!
    return { user, plan }
  },

  updateProfile: async (payload: ProfileUpdatePayload): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!currentUserId) throw new Error('Not authenticated')
    const user = mockUsers.find((u) => u.id === currentUserId)!
    Object.assign(user, payload)
    return user
  },

  completeOnboarding: async (payload: OnboardingPayload): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!currentUserId) throw new Error('Not authenticated')
    const user = mockUsers.find((u) => u.id === currentUserId)!
    Object.assign(user, {
      ...payload,
      onboarded: true,
    })
    return user
  },
}

// Request APIs
export const requestApi = {
  createRequest: async (payload: CreateRequestPayload): Promise<ResearchRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!currentUserId) throw new Error('Not authenticated')
    const request: ResearchRequest = {
      id: String(mockRequests.length + 1),
      userId: currentUserId,
      ...payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockRequests.push(request)

    // Auto-create a brief for demo purposes (use same ID as request for simplicity)
    const brief: InsightBrief = {
      id: request.id, // Use same ID as request for easy navigation
      requestId: request.id,
      userId: currentUserId,
      title: request.title,
      mode: request.insightMode,
      status: request.insightMode === 'ai-plus-human' ? 'needs-review' : 'completed',
      isShareable: false,
      sections: [
        { key: 'exec-summary', title: 'Executive Summary', content: 'AI-generated executive summary...' },
        { key: 'context', title: 'Context', content: 'AI-generated context...' },
        { key: 'drivers', title: 'Key Drivers', content: 'AI-generated drivers...' },
        { key: 'competitive', title: 'Competitive Landscape', content: 'AI-generated competitive analysis...' },
        { key: 'opportunities', title: 'Opportunities', content: 'AI-generated opportunities...' },
        { key: 'risks', title: 'Risks', content: 'AI-generated risks...' },
        { key: 'recommendations', title: 'Recommendations', content: 'AI-generated recommendations...' },
        { key: 'notes', title: 'Notes', content: 'AI-generated notes...' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockBriefs.push(brief)

    if (request.insightMode === 'ai-plus-human') {
      const job: HumanReviewJob = {
        id: String(mockJobs.length + 1),
        briefId: brief.id,
        briefTitle: brief.title,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockJobs.push(job)
    }

    return request
  },

  getRequests: async (): Promise<ResearchRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!currentUserId) throw new Error('Not authenticated')
    return mockRequests.filter((r) => r.userId === currentUserId)
  },

  getRequestById: async (id: string): Promise<ResearchRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const request = mockRequests.find((r) => r.id === id)
    if (!request) throw new Error('Request not found')
    return request
  },
}

// Brief APIs
export const briefApi = {
  getBriefs: async (): Promise<InsightBrief[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!currentUserId) throw new Error('Not authenticated')
    return mockBriefs.filter((b) => b.userId === currentUserId)
  },

  getBriefById: async (id: string): Promise<InsightBrief> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const brief = mockBriefs.find((b) => b.id === id)
    if (!brief) throw new Error('Brief not found')
    return brief
  },

  getBriefByRequestId: async (requestId: string): Promise<InsightBrief | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const brief = mockBriefs.find((b) => b.requestId === requestId)
    return brief || null
  },

  regenerateSection: async (payload: RegenerateSectionPayload): Promise<InsightBrief> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const brief = mockBriefs.find((b) => b.id === payload.briefId)
    if (!brief) throw new Error('Brief not found')
    const section = brief.sections.find((s) => s.key === payload.sectionKey)
    if (section) {
      section.content = `Regenerated content for ${section.title}${payload.extraInstructions ? ` (${payload.extraInstructions})` : ''}...`
    }
    brief.updatedAt = new Date().toISOString()
    return brief
  },

  toggleShare: async (briefId: string, isShareable: boolean): Promise<InsightBrief> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const brief = mockBriefs.find((b) => b.id === briefId)
    if (!brief) throw new Error('Brief not found')
    brief.isShareable = isShareable
    if (isShareable && !brief.shareSlug) {
      brief.shareSlug = `brief-${brief.id}-${Date.now()}`
    }
    brief.updatedAt = new Date().toISOString()
    return brief
  },

  getPublicBriefBySlug: async (slug: string): Promise<InsightBrief> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const brief = mockBriefs.find((b) => b.shareSlug === slug && b.isShareable)
    if (!brief) throw new Error('Brief not found or not shareable')
    return brief
  },
}

// Human Review APIs
export const reviewApi = {
  getHumanReviewJobs: async (filter?: { status?: string }): Promise<HumanReviewJob[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let jobs = [...mockJobs]
    if (filter?.status) {
      jobs = jobs.filter((j) => j.status === filter.status)
    }
    return jobs
  },

  startHumanReview: async (jobId: string): Promise<HumanReviewJob> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const job = mockJobs.find((j) => j.id === jobId)
    if (!job) throw new Error('Job not found')
    job.status = 'in-progress'
    job.assignedTo = currentAnalystId || 'analyst-1'
    job.updatedAt = new Date().toISOString()
    return job
  },

  submitHumanInsight: async (payload: HumanInsightPayload): Promise<InsightBrief> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const brief = mockBriefs.find((b) => b.id === payload.briefId)
    if (!brief) throw new Error('Brief not found')
    brief.humanInsightSections = payload.sections.map((s) => ({
      key: s.key,
      title: brief.sections.find((sec) => sec.key === s.key)?.title || s.key,
      content: s.content,
    }))
    brief.status = 'completed'
    brief.updatedAt = new Date().toISOString()

    const job = mockJobs.find((j) => j.briefId === payload.briefId)
    if (job) {
      job.status = 'completed'
      job.updatedAt = new Date().toISOString()
    }

    return brief
  },
}

// Notification APIs
export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!currentUserId) throw new Error('Not authenticated')
    return mockNotifications.filter((n) => n.userId === currentUserId)
  },

  markNotificationRead: async (id: string): Promise<Notification> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const notification = mockNotifications.find((n) => n.id === id)
    if (!notification) throw new Error('Notification not found')
    notification.read = true
    return notification
  },
}

// Analyst Auth
export const analystApi = {
  login: async (credentials: LoginCredentials): Promise<{ analystId: string; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (credentials.email === 'analyst@insightlayer.com' && credentials.password === 'password') {
      currentAnalystId = 'analyst-1'
      return { analystId: 'analyst-1', token: 'analyst-token-1' }
    }
    throw new Error('Invalid credentials')
  },
}


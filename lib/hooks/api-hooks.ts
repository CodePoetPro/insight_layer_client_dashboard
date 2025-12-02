'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userApi,
  requestApi,
  briefApi,
  reviewApi,
  notificationApi,
} from '@/lib/api/mock'
import type {
  CreateRequestPayload,
  RegenerateSectionPayload,
  ProfileUpdatePayload,
  OnboardingPayload,
  HumanInsightPayload,
} from '@/lib/api/types'

// User hooks
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getMe(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => userApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: OnboardingPayload) => userApi.completeOnboarding(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// Request hooks
export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: () => requestApi.getRequests(),
  })
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => requestApi.getRequestById(id),
    enabled: !!id,
  })
}

export function useCreateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => requestApi.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
      queryClient.invalidateQueries({ queryKey: ['briefs'] })
    },
  })
}

// Brief hooks
export function useBriefs() {
  return useQuery({
    queryKey: ['briefs'],
    queryFn: () => briefApi.getBriefs(),
  })
}

export function useBrief(id: string) {
  return useQuery({
    queryKey: ['brief', id],
    queryFn: () => briefApi.getBriefById(id),
    enabled: !!id,
  })
}

export function useRegenerateSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegenerateSectionPayload) => briefApi.regenerateSection(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['brief', variables.briefId] })
    },
  })
}

export function useToggleShare() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ briefId, isShareable }: { briefId: string; isShareable: boolean }) =>
      briefApi.toggleShare(briefId, isShareable),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['brief', variables.briefId] })
    },
  })
}

export function usePublicBrief(slug: string) {
  return useQuery({
    queryKey: ['public-brief', slug],
    queryFn: () => briefApi.getPublicBriefBySlug(slug),
    enabled: !!slug,
  })
}

// Review hooks
export function useHumanReviewJobs(filter?: { status?: string }) {
  return useQuery({
    queryKey: ['review-jobs', filter],
    queryFn: () => reviewApi.getHumanReviewJobs(filter),
  })
}

export function useStartHumanReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => reviewApi.startHumanReview(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-jobs'] })
    },
  })
}

export function useSubmitHumanInsight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: HumanInsightPayload) => reviewApi.submitHumanInsight(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['review-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['brief', data.id] })
    },
  })
}

// Notification hooks
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}


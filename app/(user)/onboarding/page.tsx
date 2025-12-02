'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useCompleteOnboarding, useMe } from '@/lib/hooks/api-hooks'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

const ROLES = ['Founder', 'Strategy', 'Consultant', 'Analyst', 'Other']
const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
]

const USE_CASES = [
  'Market analysis',
  'Competitor research',
  'Strategy briefs',
  'Investor decks',
  'Other',
]

const AUDIENCES = [
  'Executive team',
  'Investors',
  'Board members',
  'Clients',
  'Internal stakeholders',
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const { data: meData } = useMe()
  const router = useRouter()
  const { toast } = useToast()
  const completeOnboarding = useCompleteOnboarding()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    role: '',
    timezone: '',
    useCases: [] as string[],
    audience: [] as string[],
  })

  useEffect(() => {
    if (user?.onboarded) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleUseCaseToggle = (useCase: string) => {
    setFormData((prev) => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter((uc) => uc !== useCase)
        : [...prev.useCases, useCase],
    }))
  }

  const handleAudienceToggle = (audience: string) => {
    setFormData((prev) => ({
      ...prev,
      audience: prev.audience.includes(audience)
        ? prev.audience.filter((a) => a !== audience)
        : [...prev.audience, audience],
    }))
  }

  const handleFinish = async () => {
    if (!formData.role || !formData.timezone || formData.useCases.length === 0) {
      toast({
        title: 'Error',
        description: 'Please complete all required fields',
        variant: 'destructive',
      })
      return
    }

    try {
      await completeOnboarding.mutateAsync({
        name: formData.name,
        company: formData.company || undefined,
        role: formData.role,
        timezone: formData.timezone,
        useCases: formData.useCases,
        audience: formData.audience,
      })
      toast({
        title: 'Success',
        description: 'Onboarding completed!',
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive',
      })
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to InsightLayer</h1>
          <p className="text-muted-foreground mt-1">Let's set up your profile</p>
        </div>

        <Tabs value={String(step)} onValueChange={(v) => setStep(Number(v))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1">Profile</TabsTrigger>
            <TabsTrigger value="2">Use Case</TabsTrigger>
            <TabsTrigger value="3">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Profile</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setStep(2)} className="w-full">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Use Case & Preferences</CardTitle>
                <CardDescription>How will you use InsightLayer?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>What will you primarily use InsightLayer for?</Label>
                  <div className="space-y-2">
                    {USE_CASES.map((useCase) => (
                      <div key={useCase} className="flex items-center space-x-2">
                        <Checkbox
                          id={useCase}
                          checked={formData.useCases.includes(useCase)}
                          onCheckedChange={() => handleUseCaseToggle(useCase)}
                        />
                        <Label htmlFor={useCase} className="cursor-pointer">
                          {useCase}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Typical audience of your briefs?</Label>
                  <div className="space-y-2">
                    {AUDIENCES.map((audience) => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Checkbox
                          id={audience}
                          checked={formData.audience.includes(audience)}
                          onCheckedChange={() => handleAudienceToggle(audience)}
                        />
                        <Label htmlFor={audience} className="cursor-pointer">
                          {audience}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>Review your plan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meData && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">{meData.plan.name} Plan</div>
                      <div className="text-muted-foreground">
                        ${meData.plan.price}/month
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>AI Credits</span>
                        <span className="font-medium">{meData.plan.aiCredits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Human Insight Credits</span>
                        <span className="font-medium">{meData.plan.humanInsightCredits}</span>
                      </div>
                    </div>
                  </div>
                )}
                <Button onClick={handleFinish} className="w-full" disabled={completeOnboarding.isPending}>
                  {completeOnboarding.isPending ? 'Finishing...' : 'Finish & go to dashboard'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}


'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useMe, useBriefs } from '@/lib/hooks/api-hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Eye } from 'lucide-react'
import { format } from 'date-fns'


export default function DashboardPage() {
  const { user } = useAuth()
  const { data: meData } = useMe()
  const { data: briefs } = useBriefs()
  const router = useRouter()

  useEffect(() => {
    if (user && !user.onboarded) {
      router.push('/onboarding')
    }
  }, [user, router])

  const handleNewRequest = () => {
    router.push('/requests/new')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your research requests
          </p>
        </div>
        <Button onClick={handleNewRequest}>
          <Plus className="mr-2 h-4 w-4" />
          New Research Request
        </Button>
      </div>

      {meData && (
        <Card>
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Your current credit balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-8">
              <div>
                <div className="text-2xl font-bold">{meData.plan.aiCredits}</div>
                <div className="text-sm text-muted-foreground">AI Credits</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{meData.plan.humanInsightCredits}</div>
                <div className="text-sm text-muted-foreground">Human Insight Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Insight Briefs</CardTitle>
          <CardDescription>Your latest research briefs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {briefs && briefs.length > 0 ? (
              <div className="space-y-2">
                {briefs.map((brief) => (
                  <div
                    key={brief.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{brief.title}</h3>
                        <Badge variant={brief.mode === 'ai-only' ? 'default' : 'secondary'}>
                          {brief.mode === 'ai-only' ? 'AI Only' : 'AI + Human'}
                        </Badge>
                        <Badge variant="outline">{brief.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Updated {format(new Date(brief.updatedAt), 'PPp')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/briefs/${brief.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No briefs yet. Create your first research request to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


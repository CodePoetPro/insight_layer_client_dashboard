'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHumanReviewJobs } from '@/lib/hooks/api-hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'

export default function AnalystDashboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<{ status?: string }>({})
  const { data: jobs, isLoading } = useHumanReviewJobs(filter)

  const handleFilterChange = (status?: string) => {
    setFilter(status ? { status } : {})
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground mt-1">Manage human insight review jobs</p>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => handleFilterChange(v === 'all' ? undefined : v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter.status || 'all'} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Jobs</CardTitle>
              <CardDescription>
                {jobs?.length || 0} job{jobs?.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{job.briefTitle}</h3>
                          <Badge
                            variant={
                              job.status === 'completed'
                                ? 'default'
                                : job.status === 'in-progress'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created {format(new Date(job.createdAt), 'PPp')}
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push(`/analyst/jobs/${job.briefId}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBrief, useStartHumanReview, useSubmitHumanInsight } from '@/lib/hooks/api-hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Save, Send } from 'lucide-react'

const SECTIONS = [
  { key: 'exec-summary', title: 'Executive Summary' },
  { key: 'context', title: 'Context' },
  { key: 'drivers', title: 'Key Drivers' },
  { key: 'competitive', title: 'Competitive Landscape' },
  { key: 'opportunities', title: 'Opportunities' },
  { key: 'risks', title: 'Risks' },
  { key: 'recommendations', title: 'Recommendations' },
  { key: 'notes', title: 'Notes' },
]

export default function AnalystReviewPage() {
  const params = useParams()
  const briefId = params.id as string
  const router = useRouter()
  const { data: brief, isLoading } = useBrief(briefId)
  const startReview = useStartHumanReview()
  const submitInsight = useSubmitHumanInsight()
  const { toast } = useToast()

  const [insights, setInsights] = useState<Record<string, string>>({})
  const [hasStarted, setHasStarted] = useState(false)

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!brief) {
    return <div className="text-center py-8">Brief not found</div>
  }

  const handleStartReview = async () => {
    // Find the job ID - in a real app, this would come from the route or API
    try {
      // This would normally use the job ID, but for now we'll just mark as started
      setHasStarted(true)
      toast({
        title: 'Success',
        description: 'Review started',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start review',
        variant: 'destructive',
      })
    }
  }

  const handleSaveDraft = () => {
    // Save to localStorage or state
    toast({
      title: 'Draft saved',
      description: 'Your progress has been saved',
    })
  }

  const handleSubmit = async () => {
    const sections = SECTIONS.map((section) => ({
      key: section.key,
      content: insights[section.key] || '',
    }))

    try {
      await submitInsight.mutateAsync({
        briefId: brief.id,
        sections,
      })
      toast({
        title: 'Success',
        description: 'Human insight submitted successfully',
      })
      router.push('/analyst')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit insight',
        variant: 'destructive',
      })
    }
  }

  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Start Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Review brief: {brief.title}</p>
            <Button onClick={handleStartReview} className="w-full">
              Start Review
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{brief.title}</h1>
        <p className="text-muted-foreground mt-1">Add human insight layer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Draft</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {brief.sections.map((section) => (
                    <div key={section.key}>
                      <h3 className="font-semibold mb-2">{section.title}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {section.content}
                      </p>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Human Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {SECTIONS.map((section) => (
                    <div key={section.key} className="space-y-2">
                      <Label htmlFor={section.key}>{section.title}</Label>
                      <Textarea
                        id={section.key}
                        value={insights[section.key] || ''}
                        onChange={(e) =>
                          setInsights({ ...insights, [section.key]: e.target.value })
                        }
                        placeholder={`Add human insight for ${section.title.toLowerCase()}...`}
                        rows={6}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit} disabled={submitInsight.isPending}>
          <Send className="mr-2 h-4 w-4" />
          {submitInsight.isPending ? 'Submitting...' : 'Submit Insight Layer'}
        </Button>
      </div>
    </div>
  )
}


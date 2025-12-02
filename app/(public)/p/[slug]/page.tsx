'use client'

import { useParams } from 'next/navigation'
import { usePublicBrief } from '@/lib/hooks/api-hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'

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

export default function PublicBriefPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: brief, isLoading } = usePublicBrief(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Brief not found</h1>
          <p className="text-muted-foreground">This brief may have been removed or is not publicly shared.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{brief.title}</h1>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Badge variant={brief.mode === 'ai-only' ? 'default' : 'secondary'}>
              {brief.mode === 'ai-only' ? 'AI Only' : 'AI + Human'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Updated {format(new Date(brief.updatedAt), 'PPp')}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {brief.mode === 'ai-plus-human' && brief.humanInsightSections && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Human Insight Layer</h2>
                  <Badge variant="secondary">Human Insight</Badge>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-6">
                  {brief.humanInsightSections.map((section) => (
                    <div key={section.key}>
                      <h3 className="font-semibold mb-2">{section.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Insight Brief</h2>
              <Separator className="mb-4" />
              <div className="space-y-6">
                {brief.sections.map((section) => (
                  <div key={section.key}>
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {section.content}
                    </p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


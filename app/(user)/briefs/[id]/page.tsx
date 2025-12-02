'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useBrief, useRegenerateSection, useToggleShare } from '@/lib/hooks/api-hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { Download, Share2, RefreshCw, FileText } from 'lucide-react'
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

export default function BriefPage() {
  const params = useParams()
  const id = params.id as string
  const { data: brief, isLoading } = useBrief(id)
  const regenerateSection = useRegenerateSection()
  const toggleShare = useToggleShare()
  const { toast } = useToast()

  const [selectedSection, setSelectedSection] = useState('exec-summary')
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)
  const [regenerateSectionKey, setRegenerateSectionKey] = useState('')
  const [extraInstructions, setExtraInstructions] = useState('')

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!brief) {
    return <div className="text-center py-8">Brief not found</div>
  }

  const currentSection = brief.sections.find((s) => s.key === selectedSection)
  const humanSection = brief.humanInsightSections?.find((s) => s.key === selectedSection)

  const handleRegenerate = async () => {
    try {
      await regenerateSection.mutateAsync({
        briefId: brief.id,
        sectionKey: regenerateSectionKey,
        extraInstructions: extraInstructions || undefined,
      })
      toast({
        title: 'Success',
        description: 'Section regenerated successfully',
      })
      setRegenerateDialogOpen(false)
      setExtraInstructions('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to regenerate section',
        variant: 'destructive',
      })
    }
  }

  const handleToggleShare = async () => {
    try {
      await toggleShare.mutateAsync({
        briefId: brief.id,
        isShareable: !brief.isShareable,
      })
      toast({
        title: 'Success',
        description: brief.isShareable ? 'Brief unshared' : 'Brief shared',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update share settings',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{brief.title}</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={brief.mode === 'ai-only' ? 'default' : 'secondary'}>
              {brief.mode === 'ai-only' ? 'AI Only' : 'AI + Human'}
            </Badge>
            <Badge variant="outline">{brief.status}</Badge>
            <span className="text-sm text-muted-foreground">
              Updated {format(new Date(brief.updatedAt), 'PPp')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Export as DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleToggleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            {brief.isShareable ? 'Unshare' : 'Share'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-1">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setSelectedSection(section.key)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedSection === section.key
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {brief.mode === 'ai-plus-human' && humanSection && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Human Insight Layer</h2>
                  <Badge variant="secondary">Human Insight</Badge>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{humanSection.content}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {currentSection?.title || 'Section'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRegenerateSectionKey(selectedSection)
                    setRegenerateDialogOpen(true)
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              <Separator className="mb-4" />
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">
                  {currentSection?.content || 'No content available'}
                </p>
              </div>
              {brief.mode === 'ai-only' && (
                <div className="mt-4 text-sm text-muted-foreground">
                  AI-generated content
                </div>
              )}
            </CardContent>
          </Card>

          {brief.mode === 'ai-plus-human' && (
            <Card>
              <CardContent className="p-6">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-muted-foreground">
                    Show AI version
                  </summary>
                  <div className="mt-4 prose max-w-none">
                    <p className="whitespace-pre-wrap">
                      {currentSection?.content || 'No content available'}
                    </p>
                  </div>
                </details>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Section</DialogTitle>
            <DialogDescription>
              Regenerate the {SECTIONS.find((s) => s.key === regenerateSectionKey)?.title} section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instructions">Extra Instructions (optional)</Label>
              <Textarea
                id="instructions"
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                placeholder="Add any specific instructions for regeneration..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegenerate} disabled={regenerateSection.isPending}>
              {regenerateSection.isPending ? 'Regenerating...' : 'Regenerate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


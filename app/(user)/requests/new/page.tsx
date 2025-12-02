'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateRequest } from '@/lib/hooks/api-hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { X, Plus } from 'lucide-react'

export default function NewRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const createRequest = useCreateRequest()

  const [formData, setFormData] = useState({
    title: '',
    coreQuestion: '',
    context: '',
    outputType: '',
    targetAudience: '',
    depth: 'standard',
    timeHorizon: '',
    subquestions: [] as string[],
    insightMode: 'ai-only' as 'ai-only' | 'ai-plus-human',
  })

  const [newSubquestion, setNewSubquestion] = useState('')

  const handleAddSubquestion = () => {
    if (newSubquestion.trim()) {
      setFormData({
        ...formData,
        subquestions: [...formData.subquestions, newSubquestion.trim()],
      })
      setNewSubquestion('')
    }
  }

  const handleRemoveSubquestion = (index: number) => {
    setFormData({
      ...formData,
      subquestions: formData.subquestions.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const request = await createRequest.mutateAsync(formData)
      toast({
        title: 'Success',
        description: 'Research request created successfully',
      })
      router.push(`/briefs/${request.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create request',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Research Request</h1>
        <p className="text-muted-foreground mt-1">Create a new research request</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Question</CardTitle>
            <CardDescription>What do you want to research?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coreQuestion">Core Question</Label>
              <Textarea
                id="coreQuestion"
                value={formData.coreQuestion}
                onChange={(e) => setFormData({ ...formData, coreQuestion: e.target.value })}
                required
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Context (optional)</Label>
              <Textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output Preferences</CardTitle>
            <CardDescription>How should the brief be formatted?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outputType">Output Type</Label>
              <Select
                value={formData.outputType}
                onValueChange={(value) => setFormData({ ...formData, outputType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive-brief">Executive Brief</SelectItem>
                  <SelectItem value="research-report">Research Report</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="memo">Memo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="board">Board</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <RadioGroup
                value={formData.depth}
                onValueChange={(value) => setFormData({ ...formData, depth: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="summary" id="summary" />
                  <Label htmlFor="summary">Summary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deep" id="deep" />
                  <Label htmlFor="deep">Deep</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeHorizon">Time Horizon</Label>
              <Select
                value={formData.timeHorizon}
                onValueChange={(value) => setFormData({ ...formData, timeHorizon: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                  <SelectItem value="short">Short-term (3-12 months)</SelectItem>
                  <SelectItem value="medium">Medium-term (1-3 years)</SelectItem>
                  <SelectItem value="long">Long-term (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subquestions</CardTitle>
            <CardDescription>Additional questions to explore</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newSubquestion}
                onChange={(e) => setNewSubquestion(e.target.value)}
                placeholder="Add a subquestion"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubquestion()
                  }
                }}
              />
              <Button type="button" onClick={handleAddSubquestion}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.subquestions.map((sq, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={sq} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubquestion(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insight Mode</CardTitle>
            <CardDescription>Choose your insight generation mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="human-insight"
                checked={formData.insightMode === 'ai-plus-human'}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    insightMode: checked ? 'ai-plus-human' : 'ai-only',
                  })
                }
              />
              <Label htmlFor="human-insight" className="cursor-pointer">
                Add Human Insight Layer
              </Label>
            </div>
            {formData.insightMode === 'ai-plus-human' && (
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
                This will use 1 Human Insight credit. A human analyst will review and enhance
                the AI-generated brief.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createRequest.isPending}>
            {createRequest.isPending ? 'Creating...' : 'Create Request'}
          </Button>
        </div>
      </form>
    </div>
  )
}


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold">InsightLayer</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI-Powered Research & Insights
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Transform your research process with AI-generated insights and human expertise.
            Get comprehensive briefs tailored to your needs.
          </p>
          <div className="flex space-x-4">
            <Button asChild size="lg">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}


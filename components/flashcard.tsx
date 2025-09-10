"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface FlashcardProps {
  question: string
  answer: string
}

export function FlashcardComponent({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative">
      <Card
        className="min-h-[200px] cursor-pointer transition-all duration-300 hover:shadow-lg bg-card border-border"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <CardContent className="flex items-center justify-center p-8 text-center">
          <div className="space-y-4">
            <div className="text-lg font-medium text-card-foreground">{isFlipped ? answer : question}</div>
            <div className="text-sm text-muted-foreground">{isFlipped ? "Answer" : "Question"}</div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={(e) => {
          e.stopPropagation()
          setIsFlipped(!isFlipped)
        }}
        size="sm"
        variant="outline"
        className="absolute top-4 right-4 bg-background border-border"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}

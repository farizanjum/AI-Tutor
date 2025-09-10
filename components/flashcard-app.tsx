"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Brain, Plus, Sparkles, MessageCircle } from "lucide-react"
import { FlashcardDeck } from "./flashcard-deck"
import { AiTutor } from "./ai-tutor"

interface Flashcard {
  id: string
  question: string
  answer: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  created: string
}

export function FlashcardApp() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      question: "What is the derivative of x²?",
      answer: "2x",
      subject: "Mathematics",
      difficulty: "easy",
      created: new Date().toISOString(),
    },
    {
      id: "2",
      question: "What is a variable in programming?",
      answer:
        "A storage location with an associated name that contains data which can be modified during program execution.",
      subject: "Programming",
      difficulty: "easy",
      created: new Date().toISOString(),
    },
  ])

  const [isGenerating, setIsGenerating] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const generateFlashcards = async (topic: string, count = 5) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count }),
      })

      if (!response.ok) throw new Error("Failed to generate flashcards")

      const data = await response.json()
      const newCards: Flashcard[] = data.flashcards.map((card: any, index: number) => ({
        id: Date.now() + index + "",
        question: card.question,
        answer: card.answer,
        subject: card.subject || topic,
        difficulty: card.difficulty || "medium",
        created: new Date().toISOString(),
      }))

      setFlashcards((prev) => [...prev, ...newCards])
      setNewTopic("")
    } catch (error) {
      console.error("Error generating flashcards:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addCustomCard = (question: string, answer: string, subject: string) => {
    const newCard: Flashcard = {
      id: Date.now() + "",
      question,
      answer,
      subject,
      difficulty: "medium",
      created: new Date().toISOString(),
    }
    setFlashcards((prev) => [...prev, newCard])
  }

  const deleteCard = (id: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id))
  }

  const filteredCards =
    selectedSubject === "all"
      ? flashcards
      : flashcards.filter((card) => card.subject.toLowerCase().includes(selectedSubject.toLowerCase()))

  const subjects = Array.from(new Set(flashcards.map((card) => card.subject)))

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Flashcard Tutor</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Study smarter with AI-generated flashcards and personalized tutoring
        </p>
      </div>

      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="tutor" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Tutor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="space-y-6">
          {/* Generate New Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate AI Flashcards
              </CardTitle>
              <CardDescription>Enter any topic and let AI create study cards for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Python functions, World War 2, Calculus derivatives..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && newTopic.trim() && generateFlashcards(newTopic)}
                />
                <Button onClick={() => generateFlashcards(newTopic)} disabled={isGenerating || !newTopic.trim()}>
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => generateFlashcards("JavaScript basics")}>
                  JavaScript Basics
                </Button>
                <Button variant="outline" size="sm" onClick={() => generateFlashcards("Biology cells")}>
                  Biology Cells
                </Button>
                <Button variant="outline" size="sm" onClick={() => generateFlashcards("Spanish vocabulary")}>
                  Spanish Vocab
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Filter by subject:</span>
            <Button
              variant={selectedSubject === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject("all")}
            >
              All ({flashcards.length})
            </Button>
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject} ({flashcards.filter((c) => c.subject === subject).length})
              </Button>
            ))}
          </div>

          {/* Flashcard Deck */}
          {filteredCards.length > 0 ? (
            <FlashcardDeck flashcards={filteredCards} onDeleteCard={deleteCard} onAddCustomCard={addCustomCard} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate some AI flashcards or create your own to get started
                </p>
                <Button onClick={() => generateFlashcards("General knowledge")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Sample Cards
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tutor">
          <AiTutor />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, RotateCcw, Trash2, Plus, Eye, EyeOff } from "lucide-react"

interface Flashcard {
  id: string
  question: string
  answer: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  created: string
}

interface FlashcardDeckProps {
  flashcards: Flashcard[]
  onDeleteCard: (id: string) => void
  onAddCustomCard: (question: string, answer: string, subject: string) => void
}

export function FlashcardDeck({ flashcards, onDeleteCard, onAddCustomCard }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)

  // Custom card form
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [newSubject, setNewSubject] = useState("")

  const currentCard = flashcards[currentIndex]

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const handleCorrect = () => {
    setCorrectCount((prev) => prev + 1)
    nextCard()
  }

  const handleIncorrect = () => {
    setIncorrectCount((prev) => prev + 1)
    nextCard()
  }

  const resetStudySession = () => {
    setCorrectCount(0)
    setIncorrectCount(0)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const addCustomCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      onAddCustomCard(newQuestion, newAnswer, newSubject || "Custom")
      setNewQuestion("")
      setNewAnswer("")
      setNewSubject("")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!currentCard) return null

  return (
    <div className="space-y-6">
      {/* Study Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          {studyMode && (
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50">
                ✓ {correctCount}
              </Badge>
              <Badge variant="outline" className="bg-red-50">
                ✗ {incorrectCount}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setStudyMode(!studyMode)}>
            {studyMode ? "Exit Study Mode" : "Study Mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={resetStudySession}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Flashcard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Question</label>
                  <Textarea
                    placeholder="Enter your question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea
                    placeholder="Enter the answer..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="e.g., Mathematics, History..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>
                <Button onClick={addCustomCard} className="w-full">
                  Add Flashcard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Flashcard */}
      <Card className="relative min-h-[300px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <CardContent className="p-8 h-full flex flex-col justify-center">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge variant="secondary">{currentCard.subject}</Badge>
            <Badge className={getDifficultyColor(currentCard.difficulty)}>{currentCard.difficulty}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteCard(currentCard.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {isFlipped ? <Eye className="h-5 w-5 mr-2" /> : <EyeOff className="h-5 w-5 mr-2" />}
              <span className="text-sm text-muted-foreground">{isFlipped ? "Answer" : "Question"}</span>
            </div>
            <div className="text-lg font-medium leading-relaxed">
              {isFlipped ? currentCard.answer : currentCard.question}
            </div>
            {!isFlipped && <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>}
          </div>
        </CardContent>
      </Card>

      {/* Navigation and Study Controls */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevCard} disabled={flashcards.length <= 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {studyMode && isFlipped && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleIncorrect} className="text-red-600 bg-transparent">
              ✗ Incorrect
            </Button>
            <Button onClick={handleCorrect} className="bg-green-600 hover:bg-green-700">
              ✓ Correct
            </Button>
          </div>
        )}

        <Button variant="outline" onClick={nextCard} disabled={flashcards.length <= 1}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

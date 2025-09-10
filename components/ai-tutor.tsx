"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MessageCircle, BookOpen, Target, HelpCircle, Clock } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface TutorResponse {
  diagnosis: string
  plan: Array<{
    step: number
    title: string
    type: "explain" | "practice" | "review" | "resource"
    time: string
    payload: any
  }>
  micro_quiz: {
    questions: Array<{
      q: string
      choices?: string[]
      answer: string
    }>
  }
  explanations: {
    concise: string
    worked_example: string
    deep: string
  }
  safety_notice: string
}

export function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const renderTutorResponse = (content: string) => {
    try {
      // More robust JSON extraction
      let cleanContent = content.trim()

      // Remove markdown code blocks
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/```json\n?/, "").replace(/\n?```$/, "")
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```\n?/, "").replace(/\n?```$/, "")
      }

      // Try to find JSON within the content using regex
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanContent = jsonMatch[0]
      }

      const response: TutorResponse = JSON.parse(cleanContent)

      return (
        <div className="space-y-4">
          {/* Diagnosis */}
          {response.diagnosis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Learning Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{response.diagnosis}</p>
              </CardContent>
            </Card>
          )}

          {/* Learning Plan */}
          {response.plan && response.plan.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Learning Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {response.plan.map((step) => (
                    <div key={step.step} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Step {step.step}
                        </Badge>
                        <Badge
                          variant={step.type === 'explain' ? 'default' : step.type === 'practice' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {step.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {step.time}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{step.title}</h4>
                      {step.type === 'practice' && Array.isArray(step.payload) ? (
                        <div className="space-y-3">
                          {step.payload.map((problem, idx) => (
                            <div key={idx} className="bg-muted p-3 rounded-lg">
                              <p className="font-medium mb-1">Problem: {problem.problem}</p>
                              <p className="text-sm text-green-600 mb-1">Answer: {problem.answer}</p>
                              <details className="text-sm">
                                <summary className="cursor-pointer text-muted-foreground">Show Solution</summary>
                                <p className="mt-2">{problem.solution}</p>
                              </details>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{step.payload}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Micro Quiz */}
          {response.micro_quiz && response.micro_quiz.questions && response.micro_quiz.questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="h-5 w-5" />
                  Quick Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {response.micro_quiz.questions.map((question, idx) => (
                    <div key={idx} className="border p-3 rounded-lg">
                      <p className="font-medium mb-2">Q{idx + 1}: {question.q}</p>
                      {question.choices && question.choices.length > 0 ? (
                        <div className="space-y-1">
                          {question.choices.map((choice, choiceIdx) => (
                            <div key={choiceIdx} className="text-sm">
                              {choice === question.answer ? (
                                <span className="text-green-600 font-medium">✓ {choice}</span>
                              ) : (
                                <span className="text-muted-foreground">{choice}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">Answer: {question.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Explanations */}
          {response.explanations && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Explanations</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="concise" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="concise">Quick Summary</TabsTrigger>
                    <TabsTrigger value="worked_example">Worked Example</TabsTrigger>
                    <TabsTrigger value="deep">Deep Dive</TabsTrigger>
                  </TabsList>
                  <TabsContent value="concise" className="mt-3">
                    <p className="text-sm">{response.explanations.concise}</p>
                  </TabsContent>
                  <TabsContent value="worked_example" className="mt-3">
                    <div className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">{response.explanations.worked_example}</div>
                  </TabsContent>
                  <TabsContent value="deep" className="mt-3">
                    <div className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">{response.explanations.deep}</div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Safety Notice */}
          {response.safety_notice && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <p className="text-sm text-orange-800">{response.safety_notice}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )
    } catch (error) {
      // If JSON parsing fails, display as formatted plain text
      return (
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="text-lg">ℹ️</div>
                <span className="font-medium">Response displayed in plain text format</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-4">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {content.split('\n').map((line, index) => {
                    // Bold main headings (lines that start with capital letters and are short)
                    if (line.trim().length > 0 && line.trim().length < 50 &&
                        /^[A-Z]/.test(line.trim()) && !line.includes('.')) {
                      return (
                        <div key={index} className="font-bold text-lg mb-2 mt-4 text-gray-800 border-l-4 border-blue-500 pl-3">
                          {line.trim()}
                        </div>
                      )
                    }
                    // Regular paragraphs
                    return (
                      <div key={index} className="mb-3 text-gray-700 leading-relaxed">
                        {line.trim() || <br />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug section - collapsible */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              🔧 Debug: Raw API Response
            </summary>
            <Card className="mt-2 border-gray-300">
              <CardContent className="pt-4">
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                  {content}
                </pre>
              </CardContent>
            </Card>
          </details>
        </div>
      )
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Tutor
          </CardTitle>
          <CardDescription>
            Get personalized help, explanations, and practice problems from your AI tutor
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Start a conversation with your AI tutor!</p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage("Can you help me understand calculus derivatives?")}
                  >
                    Help with Calculus
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sendMessage("Explain Python functions to me")}>
                    Learn Python
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sendMessage("Give me a practice problem")}>
                    Practice Problem
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      renderTutorResponse(message.content)
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                    <div className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>IntelliLearn AI is analyzing your request...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a question, request practice problems, or describe what you're struggling with..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              className="min-h-[60px]"
            />
            <Button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} className="px-6">
              Send
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendMessage("Can you give me a practice problem?")}
              disabled={isLoading}
            >
              Practice Problem
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendMessage("I need help understanding this concept better")}
              disabled={isLoading}
            >
              Need Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendMessage("Can you explain that in a different way?")}
              disabled={isLoading}
            >
              Different Explanation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { callGemini } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Tutor API route called")
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    console.log("[v0] Request body:", { messageLength: message?.length, historyLength: conversationHistory.length })

    if (!message || !message.trim()) {
      console.log("[v0] Invalid message - empty or whitespace only")
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[v0] Calling Gemini API...")
    const response = await callGemini(message.trim(), conversationHistory)

    console.log("[v0] Gemini API call successful, returning response")
    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in tutor API:", error instanceof Error ? error.message : "Unknown error")
    console.error("[v0] Full error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

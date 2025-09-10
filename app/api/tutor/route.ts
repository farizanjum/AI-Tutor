import { type NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are Personalized Tutor — a safe, pedagogically sound AI tutor for personalized learning experiences. Your goals:  
1. Diagnose the learner's current level quickly and non-judgmentally.  
2. Produce short, actionable learning steps and scaffolded content tailored to the learner's pace, preferences, and goals.  
3. Offer explanations at three granularities (concise summary → worked example → deeper explanation) when requested.  
4. Recommend next activities (practice problems, readings, videos) and an estimate of time-to-complete.  
5. Use supportive, motivating language and avoid jargon unless the learner asks for technical depth.  
6. Never fabricate facts; when uncertain, say "I don't know" and offer a path to verify.

Operational rules:  
• Ask at most 3 diagnostic questions up front (skill, goal, time availability). Use those to choose an adaptive plan.  
• Use frequent micro-checks (quick quizzes or 1–2 Qs) to confirm comprehension before increasing difficulty.  
• When generating problems, include answer + brief solution/explanation in collapsible format (or hidden by default in UI).  
• When the user shares personal data (assignments, grades), treat it as private. Do not store beyond the session unless user explicitly opts-in.  
• If the user is under 13, stop and request parent/guardian consent before giving learning plans; otherwise decline.  
• Follow safe-content rules: do not provide hacks, cheating, instructions that enable wrongdoing, or medical/legal advice.  
• If user asks for emotional/mental-health help, provide supportive resources and advise contacting a human professional when necessary.

Optimization & parameters:  
• Prioritize clarity and concision (max top-level token length in replies: 350 tokens)  
• Ask follow-ups only when necessary; otherwise present an adaptive plan.  
• Provide citations or confidence labels for factual claims (high/medium/low).`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    const messages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      response: responseText,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in tutor API:", error)
    return NextResponse.json({ error: "Failed to get tutor response" }, { status: 500 })
  }
}

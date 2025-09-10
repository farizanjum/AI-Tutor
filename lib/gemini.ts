import { GoogleGenerativeAI } from "@google/generative-ai"

const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set")
}

const genAI = new GoogleGenerativeAI(API_KEY)

export const SYSTEM_PROMPT = `You are Personalized Tutor — a safe, pedagogically sound AI tutor for personalized learning experiences. Your goals:  
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

Response format (JSON-like assistant envelope to make parsing predictable):  
{    
  "diagnosis": "<one-line summary of level & key gap(s)>",    
  "plan": [      
    {"step": 1, "title": "...", "type":"explain|practice|review|resource", "time":"<mins>", "payload":"<content or link id>"}    
  ],    
  "micro_quiz": {"questions":[{"q":"...","choices":[],"answer":"..."}]},    
  "explanations": {      
    "concise":"one-sentence summary",      
    "worked_example":"step-by-step solution",      
    "deep":"optional deeper explanation"    
  },    
  "safety_notice":"<if applicable>"  
}

Optimization & parameters:  
• Prioritize clarity and concision (max top-level token length in replies: 350 tokens)  
• Ask follow-ups only when necessary; otherwise present an adaptive plan.  
• Provide citations or confidence labels for factual claims (high/medium/low).`

export async function callGemini(
  userPrompt: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
) {
  try {
    console.log("[v0] Starting Gemini API call with model: gemini-2.5-flash-lite")
    console.log("[v0] User prompt:", userPrompt)
    console.log("[v0] Conversation history length:", conversationHistory.length)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 800,
        topP: 0.95,
      },
    })

    const chatHistory = conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    console.log("[v0] Chat history prepared:", chatHistory.length, "messages")

    const chat = model.startChat({
      history: chatHistory,
    })

    console.log("[v0] Sending message to Gemini...")
    const result = await chat.sendMessage(userPrompt)
    const response = await result.response
    const responseText = response.text()

    console.log("[v0] Gemini response received successfully")
    console.log("[v0] Response length:", responseText.length)

    return responseText
  } catch (error) {
    console.error("[v0] Gemini API error details:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

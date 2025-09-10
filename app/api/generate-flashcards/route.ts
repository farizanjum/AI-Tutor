import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required but not set")
}

const genAI = new GoogleGenerativeAI(API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, difficulty = "medium", count = 5 } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    console.log("[v0] Generating flashcards for topic:", topic, "difficulty:", difficulty, "count:", count)

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.95,
      },
    })

    const prompt = `Generate ${count} educational flashcards about "${topic}" at ${difficulty} difficulty level.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique_id_1",
    "question": "Clear, specific question",
    "answer": "Comprehensive answer with explanation",
    "difficulty": "${difficulty}",
    "subject": "${topic}"
  }
]

Requirements:
- Questions should be clear and educational
- Answers should be informative and help learning
- Use proper JSON formatting
- No additional text outside the JSON array
- Make questions progressively challenging for ${difficulty} level`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("[v0] Raw Gemini response:", text)

    // Clean up the response to extract JSON
    let cleanedText = text.trim()

    // Remove markdown code blocks if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "")
    }

    // Try to parse the JSON
    let flashcards
    try {
      flashcards = JSON.parse(cleanedText)
      console.log("[v0] Successfully parsed flashcards:", flashcards.length, "cards")
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Cleaned text:", cleanedText)

      // Fallback: create default flashcards
      flashcards = [
        {
          id: "fallback_1",
          question: `What is the main concept of ${topic}?`,
          answer: `${topic} is an important subject that requires study and understanding.`,
          difficulty: difficulty,
          subject: topic,
        },
      ]
    }

    // Ensure we have an array
    if (!Array.isArray(flashcards)) {
      flashcards = [flashcards]
    }

    // Validate and clean up flashcards
    const validFlashcards = flashcards.map((card, index) => ({
      id: card.id || `card_${Date.now()}_${index}`,
      question: card.question || `Question about ${topic}`,
      answer: card.answer || `Answer about ${topic}`,
      difficulty: card.difficulty || difficulty,
      subject: card.subject || topic,
    }))

    console.log("[v0] Returning", validFlashcards.length, "valid flashcards")

    return NextResponse.json({
      flashcards: validFlashcards,
      topic,
      difficulty,
      count: validFlashcards.length,
    })
  } catch (error) {
    console.error("[v0] Flashcard generation error:", error)
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}

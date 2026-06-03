import OpenAI from 'openai'
import { env } from '../config/env.js'

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null

export async function generatePlanningRecommendation(prompt: string) {
  if (!openai) {
    return {
      checklist: [
        'Confirm event date, venue capacity and rain backup.',
        'Allocate budget by venue, catering, decor, photo, music and contingency.',
        'Shortlist verified vendors by city, category, rating and availability.',
      ],
      note: 'Fallback recommendation generated without OPENAI_API_KEY.',
    }
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are CelebrateLK, a Sri Lankan event planning assistant. Return concise JSON with budget, vendors, seating and checklist keys.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })

  return JSON.parse(completion.choices[0]?.message.content ?? '{}')
}

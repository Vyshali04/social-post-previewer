import express from 'express'
import axios from 'axios'
import auth from '../middleware/auth.js'
import { GROQ_API_KEY } from '../config/env.js'

const router = express.Router()

console.log('🔍 AI Module - Using GROQ_API_KEY from config:', GROQ_API_KEY ? '✅ Available' : '❌ Missing')

// =======================
// POST /api/ai/generate
// =======================
router.post('/generate', auth, async (req, res) => {
  try {
    const { content, tone, platform } = req.body

    if (!content || !tone) {
      return res.status(400).json({ message: 'Content and tone are required' })
    }

    const platformLimits = {
      twitter: 280,
      linkedin: 3000,
      instagram: 2200
    }

    const characterLimit = platformLimits[platform] || 280

    // -------- CLEAN PROMPT (IMPORTANT FIX) --------
    const prompt = `
Rewrite the content below in a ${tone} tone for ${platform}.

Guidelines:
- Keep the original meaning
- Rewrite fully (do NOT copy sentences)
- Match the tone strongly
- Make it natural and human-like
- Stay under ${characterLimit} characters
- Return ONLY the rewritten content

Content:
"${content}"
`

    let generatedContent

    try {
      console.log('🚀 Calling Groq API...')
      console.log('📝 Content:', content)
      console.log('🎯 Tone:', tone)
      console.log('📱 Platform:', platform)
      
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are an expert social media copywriter.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.75,
          max_tokens: 180
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('✅ Groq API response received')
      generatedContent =
        response.data.choices?.[0]?.message?.content?.trim()
      
      if (!generatedContent) {
        console.log('⚠️ No content generated, using fallback')
      } else {
        console.log('🎉 AI Generated:', generatedContent)
      }
    } catch (err) {
      console.error('❌ Groq API failed:', err.message)
      if (err.response) {
        console.error('❌ Status:', err.response.status)
        console.error('❌ Data:', err.response.data)
      }
    }

    // ---------- FINAL FALLBACK ----------
    if (!generatedContent) {
      const fallback = {
        professional: `We are pleased to share that ${content}, reflecting our commitment to delivering meaningful value and impactful outcomes.`,
        funny: `Well well well… ${content} 😄 Guess today just got more interesting!`,
        hype: `🔥 BIG NEWS! ${content} 🔥 This is just the beginning — stay tuned!`
      }
      generatedContent = fallback[tone] || content
    }

    // Clean quotes
    generatedContent = generatedContent.replace(/^["']|["']$/g, '')

    // Enforce character limit
    if (generatedContent.length > characterLimit) {
      generatedContent =
        generatedContent.slice(0, characterLimit - 3) + '...'
    }

    res.json({
      originalContent: content,
      generatedContent,
      tone,
      platform,
      characterCount: generatedContent.length,
      characterLimit
    })
  } catch (error) {
    console.error('AI generation error:', error.message)
    res.status(500).json({ message: 'AI generation failed' })
  }
})

// =======================
// POST /api/ai/suggest
// =======================
router.post('/suggest', auth, async (req, res) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }

    const prompt = `
Analyze the content and suggest improvements.
Return STRICT JSON with:
- improvements (array)
- hashtags (array)
- engagement_tips (array)

Content:
"${content}"
`

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a social media strategist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    res.json({
      content,
      suggestions: response.data.choices[0].message.content
    })
  } catch (error) {
    console.error('Suggestion error:', error.message)
    res.status(500).json({ message: 'Suggestion generation failed' })
  }
})

export default router

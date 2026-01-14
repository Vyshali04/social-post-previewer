import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('🔍 Config - Loading environment variables...')
console.log('🔍 Config - GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Found' : '❌ Missing')

export const GROQ_API_KEY = process.env.GROQ_API_KEY

if (!GROQ_API_KEY) {
  console.error('❌ Config - GROQ_API_KEY missing from .env file')
} else {
  console.log('✅ Config - GROQ_API_KEY loaded successfully')
}

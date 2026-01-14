import { useState, useEffect } from 'react'
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Wand2, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const PostEditor = ({ 
  content, 
  onChange, 
  platforms, 
  onPlatformsChange,
  maxChars = 280 
}) => {
  const [charCount, setCharCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCharCount(content.length)
  }, [content])

  const handlePlatformToggle = (platform) => {
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter(p => p !== platform)
      : [...platforms, platform]
    onPlatformsChange(newPlatforms)
  }

  const generateAIVersion = async (tone) => {
    if (!content.trim()) return

    setIsGenerating(true)
    try {
      const response = await axios.post('/api/ai/generate', {
        content,
        tone,
        platform: platforms[0] // Use first selected platform
      })

      const { generatedContent, characterCount, characterLimit } = response.data
      
      // Show character count info
      if (characterCount && characterLimit) {
        console.log(`AI generated ${characterCount}/${characterLimit} characters`)
      }
      
      onChange(generatedContent)
      
      // Show success message with character count
      const characterInfo = characterCount && characterLimit ? ` (${characterCount}/${characterLimit} chars)` : ''
      toast.success(`AI content generated${characterInfo}!`)
    } catch (error) {
      console.error('Error generating AI content:', error)
      toast.error('Failed to generate AI content')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const getCharCountColor = () => {
    if (charCount > maxChars * 0.9) return 'text-red-600'
    if (charCount > maxChars * 0.7) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const platformOptions = [
    { id: 'twitter', name: 'Twitter (X)', icon: Twitter, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-500' }
  ]

  const toneOptions = [
    { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
    { id: 'funny', name: 'Funny', description: 'Humorous and entertaining' },
    { id: 'hype', name: 'Hype', description: 'Energetic and exciting' }
  ]

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Platforms
        </label>
        <div className="grid grid-cols-3 gap-3">
          {platformOptions.map((platform) => {
            const Icon = platform.icon
            const isSelected = platforms.includes(platform.id)
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? `${platform.bgColor} ${platform.borderColor} ${platform.color}`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs font-medium">{platform.name}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Content
          </label>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${getCharCountColor()}`}>
              {charCount}/{maxChars}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's on your mind? Start typing your post here..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 resize-none"
          maxLength={maxChars}
        />
        {charCount > maxChars * 0.9 && (
          <p className="text-xs text-red-600 mt-1">
            You're approaching the character limit!
          </p>
        )}
      </div>

      {/* AI Tone Changer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Wand2 className="w-4 h-4 inline mr-2" />
          AI Tone Changer
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {toneOptions.map((tone) => (
            <button
              key={tone.id}
              onClick={() => generateAIVersion(tone.id)}
              disabled={isGenerating || !content.trim()}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {tone.name}
                </span>
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-primary-600" />
                ) : (
                  <Wand2 className="w-4 h-4 text-primary-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {tone.description}
              </p>
            </button>
          ))}
        </div>
        {isGenerating && (
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
            AI is working its magic...
          </p>
        )}
      </div>
    </div>
  )
}

export default PostEditor

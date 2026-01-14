import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PostEditor from '../components/PostEditor'
import SocialPreview from '../components/SocialPreview'
import { 
  Save, 
  Send, 
  ArrowLeft, 
  Eye,
  EyeOff,
  Tag,
  Calendar
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PostEditorPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  
  const [postData, setPostData] = useState({
    originalContent: '',
    aiGeneratedContent: '',
    tone: null,
    platforms: ['twitter'],
    tags: [],
    status: 'draft'
  })

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}`)
      const post = response.data
      setPostData({
        originalContent: post.originalContent || '',
        aiGeneratedContent: post.aiGeneratedContent || '',
        tone: post.tone || null,
        platforms: post.platforms || ['twitter'],
        tags: post.tags || [],
        status: post.status || 'draft'
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
      navigate('/dashboard')
    }
  }

  const handleContentChange = (content) => {
    setPostData(prev => ({
      ...prev,
      originalContent: content
    }))
  }

  const handlePlatformsChange = (platforms) => {
    setPostData(prev => ({
      ...prev,
      platforms
    }))
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const savePost = async (status = 'draft') => {
    if (!postData.originalContent.trim()) {
      toast.error('Please add some content to your post')
      return
    }

    if (postData.platforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...postData,
        status
      }

      let response
      if (id) {
        response = await api.put(`/api/posts/${id}`, payload)
        toast.success(`Post ${status === 'published' ? 'published' : 'updated'} successfully!`)
      } else {
        response = await api.post('/api/posts', payload)
        toast.success(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`)
        
        if (!id) {
          navigate(`/editor/${response.data.post._id}`)
        }
      }

      // If published, offer to go to dashboard
      if (status === 'published') {
        setTimeout(() => {
          if (window.confirm('Post published! Go to dashboard to see updated stats?')) {
            navigate('/dashboard')
          }
        }, 1000)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const publishPost = () => {
    savePost('published')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {id ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Craft your perfect social media post with AI assistance
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`btn btn-secondary flex items-center space-x-2`}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
          
          <button
            onClick={() => savePost('draft')}
            disabled={saving}
            className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            onClick={publishPost}
            disabled={saving}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Send size={18} />
            <span>{saving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Section */}
        <div className="space-y-6">
          <div className="card p-6">
            <PostEditor
              content={postData.originalContent}
              onChange={handleContentChange}
              platforms={postData.platforms}
              onPlatformsChange={handlePlatformsChange}
              maxChars={postData.platforms.includes('twitter') ? 280 : 3000}
            />
          </div>

          {/* Tags */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-4 h-4" />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
            </div>
            
            <form onSubmit={handleAddTag} className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                className="input flex-1"
              />
              <button
                type="submit"
                className="btn btn-secondary"
              >
                Add
              </button>
            </form>
            
            {postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Preview
              </h2>
              <div className="space-y-4">
                {postData.platforms.map((platform) => (
                  <SocialPreview
                    key={platform}
                    content={postData.originalContent}
                    platform={platform}
                    username={user?.username || 'user'}
                  />
                ))}
              </div>
            </div>

            {/* Post Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Post Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    postData.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {postData.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Platforms</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {postData.platforms.length} selected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Character Count</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {postData.originalContent.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tags</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {postData.tags.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostEditorPage

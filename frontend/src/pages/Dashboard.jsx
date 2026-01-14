import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Users,
  Calendar,
  BarChart3,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPosts: 0,
    draftPosts: 0,
    publishedPosts: 0,
    platformStats: []
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, postsResponse] = await Promise.all([
        axios.get('/api/posts/stats'),
        axios.get('/api/posts?limit=5')
      ])

      const statsData = statsResponse.data
      const statusDraft = statsData.statusBreakdown.find(s => s._id === 'draft')
      const statusPublished = statsData.statusBreakdown.find(s => s._id === 'published')

      setStats({
        totalPosts: statsData.totalPosts,
        draftPosts: statusDraft?.count || 0,
        publishedPosts: statusPublished?.count || 0,
        platformStats: statsData.platformBreakdown
      })
      setRecentPosts(postsResponse.data.posts)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data when component gains focus (user returns from editor)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading) {
        fetchDashboardData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [loading])

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await axios.delete(`/api/posts/${postId}`)
      setRecentPosts(recentPosts.filter(post => post._id !== postId))
      fetchDashboardData() // Refresh stats
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: '🐦',
      linkedin: '💼',
      instagram: '📷'
    }
    return icons[platform] || '📱'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your social media posts today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalPosts}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.draftPosts}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Edit3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.publishedPosts}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Platforms</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.platformStats.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create New Post */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/editor"
                className="flex items-center p-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-semibold">Create New Post</p>
                  <p className="text-sm opacity-90">Start with AI assistance</p>
                </div>
              </Link>
              <Link
                to="/drafts"
                className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <FileText className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-semibold">View Drafts</p>
                  <p className="text-sm opacity-75">{stats.draftPosts} drafts</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="card p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Posts
              </h2>
              <Link
                to="/drafts"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            {recentPosts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
                <Link
                  to="/editor"
                  className="btn btn-primary mt-4 inline-flex"
                >
                  Create your first post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {post.originalContent}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            {post.platforms.map((platform) => (
                              <span key={platform} title={platform}>
                                {getPlatformIcon(platform)}
                              </span>
                            ))}
                          </div>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/editor/${post._id}`}
                          className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => deletePost(post._id)}
                          className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Platform Stats */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Platform Usage
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            {stats.platformStats.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No platform data yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.platformStats.map((platform) => (
                  <div key={platform._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getPlatformIcon(platform._id)}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {platform._id}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      {platform.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="card p-6 mt-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💡 Pro Tip
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Use our AI tone changer to transform your posts for different platforms. 
              A professional tone works great for LinkedIn, while a funny tone might be better for Twitter!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

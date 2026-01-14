import { Twitter, Linkedin, Instagram, Heart, MessageCircle, Repeat2, Share } from 'lucide-react'

const SocialPreview = ({ content, platform, username = 'user' }) => {
  const getPreviewData = () => {
    switch (platform) {
      case 'twitter':
        return {
          icon: Twitter,
          color: 'border-social-twitter bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-gray-900 dark:text-white',
          metaColor: 'text-gray-500 dark:text-gray-400',
          username: '@' + username,
          displayName: username,
          time: '2m',
          maxChars: 280,
          actions: [
            { icon: MessageCircle, count: '12', color: 'text-gray-500 hover:text-blue-500' },
            { icon: Repeat2, count: '5', color: 'text-gray-500 hover:text-green-500' },
            { icon: Heart, count: '42', color: 'text-gray-500 hover:text-red-500' },
            { icon: Share, count: '', color: 'text-gray-500 hover:text-blue-500' }
          ]
        }
      case 'linkedin':
        return {
          icon: Linkedin,
          color: 'border-social-linkedin bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-gray-900 dark:text-white',
          metaColor: 'text-gray-600 dark:text-gray-400',
          username: username,
          displayName: username + ' • ' + 'Professional Title',
          time: '2m ago',
          maxChars: 3000,
          actions: [
            { icon: Heart, count: '25', color: 'text-gray-500 hover:text-red-500' },
            { icon: MessageCircle, count: '8', color: 'text-gray-500 hover:text-blue-500' },
            { icon: Share, count: '3', color: 'text-gray-500 hover:text-blue-500' }
          ]
        }
      case 'instagram':
        return {
          icon: Instagram,
          color: 'border-social-instagram bg-pink-50 dark:bg-pink-900/20',
          textColor: 'text-gray-900 dark:text-white',
          metaColor: 'text-gray-600 dark:text-gray-400',
          username: username,
          displayName: '',
          time: '2 minutes ago',
          maxChars: 2200,
          actions: [
            { icon: Heart, count: '128', color: 'text-gray-900 dark:text-white' },
            { icon: MessageCircle, count: '24', color: 'text-gray-900 dark:text-white' },
            { icon: Share, count: '', color: 'text-gray-900 dark:text-white' }
          ]
        }
      default:
        return null
    }
  }

  const preview = getPreviewData()
  if (!preview) return null

  const Icon = preview.icon

  const truncateContent = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  const displayContent = truncateContent(content, preview.maxChars)

  return (
    <div className={`social-preview ${preview.color} rounded-xl p-4`}>
      {/* Platform Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span className="font-semibold text-gray-900 dark:text-white capitalize">
            {platform}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {content.length}/{preview.maxChars} chars
        </span>
      </div>

      {/* Content Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        {platform === 'twitter' && (
          /* Twitter Preview */
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {preview.displayName}
                  </span>
                  <span className={preview.metaColor}>
                    {preview.username}
                  </span>
                  <span className={preview.metaColor}>·</span>
                  <span className={preview.metaColor}>{preview.time}</span>
                </div>
                <p className={`${preview.textColor} mt-2 whitespace-pre-wrap`}>
                  {displayContent}
                </p>
                {content.length > preview.maxChars && (
                  <p className="text-xs text-red-600 mt-1">
                    Content exceeds character limit by {content.length - preview.maxChars} characters
                  </p>
                )}
                <div className="flex items-center justify-between mt-3 max-w-md">
                  {preview.actions.map((action, index) => {
                    const ActionIcon = action.icon
                    return (
                      <button
                        key={index}
                        className={`flex items-center space-x-1 ${action.color} transition-colors`}
                      >
                        <ActionIcon size={18} />
                        {action.count && <span className="text-sm">{action.count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === 'linkedin' && (
          /* LinkedIn Preview */
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {preview.displayName}
                  </span>
                </div>
                <p className={`text-sm ${preview.metaColor}`}>
                  {preview.time} • •
                </p>
                <p className={`${preview.textColor} mt-3 whitespace-pre-wrap`}>
                  {displayContent}
                </p>
                {content.length > preview.maxChars && (
                  <p className="text-xs text-red-600 mt-1">
                    Content exceeds character limit by {content.length - preview.maxChars} characters
                  </p>
                )}
                <div className="flex items-center space-x-6 mt-4">
                  {preview.actions.map((action, index) => {
                    const ActionIcon = action.icon
                    return (
                      <button
                        key={index}
                        className={`flex items-center space-x-1 ${action.color} transition-colors`}
                      >
                        <ActionIcon size={18} />
                        {action.count && <span className="text-sm">{action.count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === 'instagram' && (
          /* Instagram Preview */
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {preview.username}
                </span>
              </div>
            </div>
            
            {/* Image placeholder for Instagram */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">
                <Instagram size={48} />
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                {preview.actions.map((action, index) => {
                  const ActionIcon = action.icon
                  return (
                    <button
                      key={index}
                      className={`${action.color} transition-colors`}
                    >
                      <ActionIcon size={24} />
                    </button>
                  )
                })}
              </div>
              <p className={`text-sm ${preview.metaColor}`}>
                {preview.actions[0].count} likes
              </p>
              <p className={`${preview.textColor} text-sm whitespace-pre-wrap`}>
                <span className="font-semibold">{preview.username}</span> {displayContent}
              </p>
              {content.length > preview.maxChars && (
                <p className="text-xs text-red-600">
                  Content exceeds character limit by {content.length - preview.maxChars} characters
                </p>
              )}
              <p className={`text-xs ${preview.metaColor}`}>
                {preview.time}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialPreview

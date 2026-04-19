import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatService, propertyService } from '../services'
import toast from 'react-hot-toast'
import { FiSend, FiHeart, FiMapPin, FiMaximize } from 'react-icons/fi'
import { useSavedProperties } from '../context/SavedPropertiesContext'

export const ChatAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI Real Estate Assistant. I can help you find the perfect property. What are you looking for?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [suggestedPrompts] = useState([
    '2BHK under 50L in Indore',
    'Rent under 15k near Vijay Nagar',
    '3BHK plots in Vijay Nagar',
    'Luxury apartments for sale',
  ])
  const { addSavedProperty, isSaved, removeSavedProperty } = useSavedProperties()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text = null) => {
    const messageText = text || input.trim()
    if (!messageText) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Send to API
    setIsLoading(true)
    try {
      const response = await chatService.sendMessage(messageText)

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.reply || response.message || 'No response received.',
        properties: response.properties || [],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])

      if (response.properties?.length > 0) {
        toast.success(`Found ${response.properties.length} properties!`)
      }
    } catch (error) {
      toast.error('Failed to get response')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProperty = (property) => {
    const propertyId = property.id || property.project_name
    if (isSaved(propertyId)) {
      removeSavedProperty(propertyId)
      propertyService.removeSavedProperty(propertyId)
      toast.success('Removed from saved')
    } else {
      addSavedProperty({ ...property, id: propertyId })
      propertyService.saveProperty(propertyId)
      toast.success('Added to saved')
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">AI Real Estate Assistant</h1>
        <p className="text-gray-600 text-sm">Ask me anything about properties</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <p className="text-gray-600">Start a conversation about properties</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-2xl rounded-br-none'
                      : 'bg-white text-gray-900 rounded-2xl rounded-bl-none border border-gray-200'
                  } px-6 py-4`}
                >
                  <p className="text-sm mb-2">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {/* Properties in Message */}
                  {message.properties && message.properties.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {message.properties.map((property) => (
                        <PropertyCardInChat
                          key={property.id || property.project_name}
                          property={{ ...property, id: property.id || property.project_name }}
                          onSave={handleSaveProperty}
                          isSaved={isSaved(property.id || property.project_name)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white text-gray-900 rounded-2xl rounded-bl-none border border-gray-200 px-6 py-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (if no messages) */}
      {messages.length === 1 && (
        <div className="px-6 pb-6 flex flex-wrap gap-2 justify-center">
          {suggestedPrompts.map((prompt, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSendMessage(prompt)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about properties... (e.g., 2BHK under 50L in Indore)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

const PropertyCardInChat = ({ property, onSave, isSaved: isPropertySaved }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 line-clamp-1">
          {property.project_name || 'Property'}
        </h4>
        <button
          onClick={() => onSave(property)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <FiHeart
            size={16}
            className={isPropertySaved ? 'fill-red-500 text-red-500' : ''}
          />
        </button>
      </div>

      <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
        <FiMapPin size={12} />
        {property.locality}, {property.city}
      </p>

      <div className="grid grid-cols-3 gap-2 text-xs text-gray-700">
        {property.price && (
          <div>
            <p className="font-semibold text-blue-600">{property.price}</p>
          </div>
        )}
        {property.rent_per_month && (
          <div>
            <p className="font-semibold text-blue-600">
              ₹{property.rent_per_month?.toLocaleString()}/mo
            </p>
          </div>
        )}
        {property.bhk && <div><p>BHK: {property.bhk}</p></div>}
        {property.area_sqft && (
          <div className="col-span-2">
            <p className="flex items-center gap-1">
              <FiMaximize size={12} />
              {property.area_sqft} sq.ft
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

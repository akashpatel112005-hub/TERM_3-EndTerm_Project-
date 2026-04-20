import { useState } from 'react'
import { BiBot, BiUser } from 'react-icons/bi'
import { AiOutlineCopy, AiOutlineCheck } from 'react-icons/ai'

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function renderText(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-3 sm:mb-4">
        <div className="flex items-end gap-1.5 sm:gap-2 max-w-[85%] sm:max-w-md">
          <div className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-br-sm text-xs sm:text-sm leading-relaxed">
            {message.text}
          </div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
            <BiUser className="text-blue-600 dark:text-blue-400" size={12} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-3 sm:mb-4 group">
      <div className="flex items-end gap-1.5 sm:gap-2 max-w-[85%] sm:max-w-lg">
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center flex-shrink-0">
          <BiBot className="text-indigo-600 dark:text-indigo-400" size={12} />
        </div>
        <div className="relative">
          <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-sm text-xs sm:text-sm leading-relaxed shadow-sm">
            {renderText(message.text)}
          </div>
          <button
            onClick={handleCopy}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            {copied
              ? <AiOutlineCheck size={11} className="text-green-500" />
              : <AiOutlineCopy size={11} className="text-gray-400" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
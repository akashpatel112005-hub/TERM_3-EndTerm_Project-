import { useState, useRef, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'History', 'Geography', 'English',
  'Economics', 'Other'
]

const LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some knowledge' },
  { value: 'advanced', label: 'Advanced', desc: 'Deep understanding needed' },
]

export default function AddTopicModal({ onClose, onAdd }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    subject: 'Computer Science',
    goal: '',
    level: 'beginner',
    notes: '',
  })

  // useRef for autofocusing the first input when modal opens
  const nameInputRef = useRef(null)

  useEffect(() => {
    // Small timeout lets the modal finish rendering before focusing
    const timer = setTimeout(() => {
      nameInputRef.current?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.goal.trim()) return
    setLoading(true)
    try {
      await onAdd(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Add new topic</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">

          {/* Topic name — ref attached here */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Topic name <span className="text-red-400">*</span>
            </label>
            <input
              ref={nameInputRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Calculus, React Hooks, World War 2"
              required
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
            >
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Your goal <span className="text-red-400">*</span>
            </label>
            <input
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="e.g. Pass my semester exam in 3 weeks"
              required
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Current level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, level: l.value }))}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                    form.level === l.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-xs sm:text-sm font-medium ${
                    form.level === l.value ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {l.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Notes{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any extra context, resources, or reminders..."
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs sm:text-sm font-medium transition"
            >
              {loading ? 'Adding...' : 'Add topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
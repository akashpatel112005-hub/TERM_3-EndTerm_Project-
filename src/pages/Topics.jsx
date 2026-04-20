import { useState, useMemo } from 'react'
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai'
import { BiBook } from 'react-icons/bi'
import { useStudy } from '../context/StudyContext'
import TopicCard from '../components/TopicCard'
import AddTopicModal from '../components/AddTopicModal'
import EditTopicModal from '../components/EditTopicModal'

export default function Topics() {
  const {
    topics,
    topicsLoading: loading,
    handleAddTopic: handleAdd,
    handleUpdateTopic: handleUpdate,
    handleDeleteTopic: handleDelete,
  } = useStudy()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')

  const filtered = useMemo(() =>
    topics.filter(t => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
      const matchLevel = filterLevel === 'all' || t.level === filterLevel
      return matchSearch && matchLevel
    }), [topics, search, filterLevel])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">My topics</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {topics.length} Learning Session{topics.length !== 1 ? 's' : ''} in Progress
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition"
          >
            <AiOutlinePlus size={15} />
            <span className="hidden sm:block">Add topic</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="flex-1 relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
            />
          </div>

          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden overflow-x-auto flex-shrink-0">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-2.5 sm:px-3 py-2 text-xs font-medium capitalize transition flex-shrink-0 ${
                  filterLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && topics.length === 0 && (
          <div className="text-center py-14 sm:py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-4">
              <BiBook className="text-blue-400 text-2xl sm:text-3xl" />
            </div>
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2 text-sm sm:text-base">No topics yet</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mb-5 sm:mb-6">
              Add your first topic to start building your study plan
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <AiOutlinePlus size={15} />
              Add your first topic
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && topics.length > 0 && filtered.length === 0 && (
          <div className="text-center py-10 sm:py-12">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No topics match your search</p>
            <button
              onClick={() => { setSearch(''); setFilterLevel('all') }}
              className="text-blue-500 text-sm mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Topics grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onDelete={handleDelete}
                onEdit={setEditingTopic}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddTopicModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}
      {editingTopic && (
        <EditTopicModal topic={editingTopic} onClose={() => setEditingTopic(null)} onUpdate={handleUpdate} />
      )}
    </div>
  )
}
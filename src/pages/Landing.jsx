import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { BiBook } from 'react-icons/bi'
import { BsLightningCharge, BsGraphUp, BsMap } from 'react-icons/bs'
import { AiOutlineCheck } from 'react-icons/ai'

const FEATURES = [
  {
    icon: <BsMap className="text-blue-500 text-xl" />,
    title: 'Personalized learning path',
    desc: 'AI builds a week-by-week study plan based on your goal, level, and deadline.',
    bg: 'bg-blue-50',
  },
  {
    icon: <BsLightningCharge className="text-purple-500 text-xl" />,
    title: 'Adaptive quiz engine',
    desc: 'AI generates fresh questions every time. Get instant feedback and explanations.',
    bg: 'bg-purple-50',
  },
  {
    icon: <BsGraphUp className="text-green-500 text-xl" />,
    title: 'AI chat tutor',
    desc: 'Ask anything. Your personal Socratic tutor that guides you to understanding.',
    bg: 'bg-green-50',
  },
]

const STATS = [
  { value: '3x', label: 'Faster exam prep' },
  { value: '500+', label: 'Study topics supported' },
  { value: '100%', label: 'Free to use' },
]

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Engineering student',
    text: 'I went from failing my DSA quizzes to scoring 85% in 2 weeks. The personalized path actually worked.',
    initials: 'PS',
    color: 'bg-blue-500',
  },
  {
    name: 'Rahul M.',
    role: 'Class 12 student',
    text: 'The AI tutor explains things better than my textbook. I use it every day before exams.',
    initials: 'RM',
    color: 'bg-purple-500',
  },
  {
    name: 'Ananya K.',
    role: 'MBA aspirant',
    text: 'Generated a 4-week GMAT study plan in seconds. Saved me hours of planning.',
    initials: 'AK',
    color: 'bg-green-500',
  },
]

const CHECKLIST = [
  'AI-generated personalized study plans',
  'Adaptive quizzes with instant feedback',
  'Socratic AI tutor for any subject',
  'Progress tracking and mastery scores',
  'Works for any subject or exam',
  'Free — no credit card required',
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <BiBook className="text-white text-lg" />
          </div>
          {/* Increased brand font size to text-lg */}
          <span className="font-bold text-gray-800 text-lg tracking-tight">Study Companion</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          Powered by AI — Free for students
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
          Study smarter with your{" "}
          <span className="text-blue-600">AI-powered</span>{" "}
          learning companion
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Stop wasting hours not knowing what to study. Get a personalized learning path,
          adaptive quizzes, and an AI tutor — all tailored to your goal and deadline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium text-sm transition"
          >
            Start studying for free
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-xl font-medium text-sm transition"
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Everything you need to ace your exams
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three powerful AI features that work together to make your study
              sessions more focused, effective, and personalized.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist + Mock preview */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Built for students who want results
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Whether you are prepping for board exams, competitive exams, or
              college tests — Study Companion adapts to your specific goal and timeline.
            </p>
            <ul className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AiOutlineCheck className="text-green-600" size={11} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock app preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-100">
            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BiBook className="text-white text-xs" />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  My learning path
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Week 1: Fundamentals', done: true },
                  { label: 'Week 2: Core concepts', done: false },
                  { label: 'Week 3: Practice and review', done: false },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        w.done ? 'bg-green-400' : i === 1 ? 'bg-blue-400' : 'bg-gray-200'
                      }`}
                    />
                    <span className="text-xs text-gray-600">{w.label}</span>
                    {w.done && (
                      <span className="ml-auto text-xs text-green-600 font-medium">
                        Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-1/3" />
              </div>
              <p className="text-xs text-gray-400 mt-1">33% complete</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-700 mb-2">AI Tutor</p>
              <div className="space-y-2">
                <div className="bg-gray-100 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-600 max-w-xs">
                  Can you explain recursion simply?
                </div>
                <div className="bg-blue-600 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white ml-auto max-w-xs">
                  Think of it like a mirror facing a mirror — each reflection calls itself...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What our community is saying
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6"
              >
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl px-8 py-14">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to study smarter?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of students already using AI to ace their exams.
            Free forever — no credit card needed.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-xl text-sm transition"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-500 text-center font-medium">
            © {new Date().getFullYear()} Study Companion
          </p>
        </div>
      </footer>

    </div>
  )
}
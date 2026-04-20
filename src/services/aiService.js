const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function callGroq(prompt) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || 'Groq API error')
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''

  // Strip markdown code fences if model wraps JSON
  return raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
}

// Generate quiz questions
export async function generateQuiz(topicName, subject, level, numQuestions = 5) {
  const prompt = `
You are a quiz generator. Generate exactly ${numQuestions} multiple choice questions 
about "${topicName}" (${subject}) for a ${level} level student.

Return ONLY a valid JSON array with no extra text, in this exact format:
[
  {
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this answer is correct"
  }
]

Rules:
- correctIndex must be 0, 1, 2, or 3 (index of the correct option)
- Make questions progressively harder
- Explanations must be clear and educational
- Return ONLY the JSON array, nothing else
`
  const raw = await callGroq(prompt)
  return JSON.parse(raw)
}

// Generate learning path
export async function generateLearningPath(topicName, subject, level, goal, weeks = 3) {
  const prompt = `
You are a study planner. Create a ${weeks}-week study plan for "${topicName}" 
(${subject}) for a ${level} student whose goal is: "${goal}".

Return ONLY a valid JSON object in this exact format:
{
  "title": "Study plan title",
  "overview": "2-3 sentence overview",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Week theme",
      "tasks": [
        { "day": "Mon", "task": "Task description", "duration": "30 min", "done": false },
        { "day": "Tue", "task": "Task description", "duration": "45 min", "done": false },
        { "day": "Wed", "task": "Task description", "duration": "30 min", "done": false },
        { "day": "Thu", "task": "Task description", "duration": "45 min", "done": false },
        { "day": "Fri", "task": "Task description", "duration": "60 min", "done": false }
      ],
      "milestone": "What the student should be able to do by end of week"
    }
  ]
}

Return ONLY the JSON object, nothing else.
`
  const raw = await callGroq(prompt)
  return JSON.parse(raw)
}

// AI chat tutor
export async function getTutorResponse(topicName, messages) {
  const history = messages
    .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`)
    .join('\n')

  const prompt = `
You are a Socratic tutor helping a student learn "${topicName}". 
Guide them with questions and clear explanations. Don't just give answers — 
help them think. Keep responses concise (2-4 sentences max).

Conversation so far:
${history}

Tutor:`

  return callGroq(prompt)
}
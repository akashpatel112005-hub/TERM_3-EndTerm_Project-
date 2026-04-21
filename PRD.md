# Product Requirements Document (PRD)

**Project Name:** Study Companion

**Tagline:** AI-Powered Study Co-Pilot for Structured Learning & Active Recall

**Document Status:** Production-Ready MVP

## 1. Executive Summary
**The Problem:** Traditional studying is often passive and overwhelming. Students struggle with information overload, lack of structured guidance for complex topics, and the difficulty of finding real-time tutoring that adapts to their specific pace and knowledge gaps.

**The Solution:** An AI-first platform that turns passive study into structured, active learning. By leveraging Large Language Models (LLMs), Study Companion generates personalized multi-week learning paths, provides a "Question-driven" AI tutor that promotes critical thinking, and creates adaptive quizzes that validate knowledge in real-time. Unlike traditional learning tools that provide direct answers, Study Companion focuses on guided learning through active recall and critical inquiry to build long-term concept mastery.

## 2. Target Audience (User Personas)
*   **The College Student (Primary):** Undergraduate students looking for semester exam preparation, concept clarity, and a structured study schedule for complex subjects.
*   **The Self-Learner (Secondary):** Individuals learning new technical skills or academic topics independently who require guided roadmaps and active recall methods.

## 3. Core User Stories
**As a Student, I want to...**
*   Securely log in and maintain a persistent profile of my learning topics.
*   Add new study topics by specifying subject, difficulty, and specific learning goals.
*   Generate a customized, multi-week **Learning Path** that breaks down a complex topic into daily tasks.
*   Interact with a **Question-driven AI Tutor** that guides me toward answers instead of just providing them.
*   Take **AI-generated Quizzes** that adapt to my level and provide detailed educational feedback.
*   Track my performance over time via a visual dashboard with score analytics.

## 4. MVP Functional Scope

### A. Authentication & User Management
*   **Tech:** Firebase Authentication & Firestore.
*   **Features:** Secure login/signup flow with persistent user sessions and personalized profiles to save topics and progress.

### B. Topic & Plan Management
*   **Tech:** Firestore (Collections: `topics`, `plans`, `users`).
*   **Features:** 
    *   **Topic Discovery:** Create and manage study areas with real-time metadata (Subject, Level, Goals).
    *   **AI Planner:** Integration with Groq API (Llama 3.3) to generate 3-week structured study plans with daily task tracking.

### C. The Learning Workspace
*   **Tech:** Groq API, React Context API.
*   **Features:**
    *   **Question-Driven AI Tutor:** A guided chat interface that helps students learn by asking meaningful questions instead of directly giving answers.
    *   **Response Constraints:** AI responses limited to 2-4 sentences for maximum focus and efficiency.

### D. Adaptive Assessment Pipeline
*   **Tech:** Groq API + Recharts.
*   **Features:**
    *   **Dynamic Quiz Engine:** On-the-fly generation of multiple-choice questions based on the current topic.
    *   **Detailed Feedback:** Instant explanations for every answer choice to reinforce learning.
    *   **Progress Analytics:** Visual score tracking using Recharts to monitor improvement over time.

## 5. Visual Identity & UX
*   **Design System:** Modern "EdTech Premium" with a focus on clarity and focus.
*   **Core Elements:** 
    *   Clean, minimalist layouts with vibrant accent colors (Electric Blue for actions).
    *   Dark/Light mode support via Tailwind CSS.
    *   Micro-animations for progress tracking and quiz interactions.
*   **Responsiveness:** Mobile-first design ensures students can study on any device.

## 6. Technical Requirements
*   **Infrastructure:** React 18 + Vite for sub-second HMR and performance.
*   **AI Engine:** Groq API utilizing `llama-3.3-70b-versatile` for high-speed, high-reasoning output.
*   **Database:** Firebase Firestore for real-time data synchronization.
*   **State Management:** Multi-context architecture (Auth, Study, Theme) for scalable data flow.

## 7. Future Roadmap (V2+)
*   **Monetization:** Subscription tiers for advanced AI features or unlimited topics.
*   **Resource Aggregator:** AI-powered recommendations for YouTube videos and articles tied to specific tasks.
*   **Social Learning:** Collaborative learning paths and peer-to-peer quiz challenges.
*   **Gamification:** Streaks, badges, and experience points (XP) to drive daily engagement.

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('compose')
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">📧 Bulk Email Sender</h1>
        <button
          onClick={() => router.push('/login')}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </nav>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'compose'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ✉️ Compose Email
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            📋 Email History
          </button>
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && <ComposeEmail />}

        {/* History Tab */}
        {activeTab === 'history' && <EmailHistory />}
      </div>
    </div>
  )
}

function ComposeEmail() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const res = await fetch('http://localhost:8000/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body }),
      })

      if (res.ok) {
        setSuccess('Email successfully bhej diya gaya! ✅')
        setTo('')
        setSubject('')
        setBody('')
      } else {
        setError('Email nahi gaya, dobara try karo')
      }
    } catch {
      setError('Server se connect nahi ho pa raha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Compose Email</h2>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To (Recipients)
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email1@gmail.com, email2@gmail.com"
            required
          />
          <p className="text-xs text-gray-400 mt-1">Comma se alag karo multiple emails</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email ka subject likho"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apna message yahan likho..."
            required
          />
        </div>

        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Sending...' : '🚀 Send Email'}
        </button>
      </form>
    </div>
  )
}

function EmailHistory() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Email History</h2>
      <div className="text-center text-gray-400 py-10">
        <p className="text-4xl mb-2">📭</p>
        <p>Abhi koi email nahi bheja gaya</p>
      </div>
    </div>
  )
}
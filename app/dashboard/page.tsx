'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logoutUser, sendEmail, getEmailHistory } from '../lib/api'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose')
  const router = useRouter()

  async function handleLogout() {
    await logoutUser()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-bold text-gray-800 text-lg">Bulk Email Sender</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'compose'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
             Compose
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
             History
          </button>
        </div>

        {activeTab === 'compose' && <ComposeEmail />}
        {activeTab === 'history' && <EmailHistory />}
      </div>
    </div>
  )
}

function ComposeEmail() {
  const [recipients, setRecipients] = useState('')
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
      const toList = recipients.split(',').map((r) => r.trim()).filter(Boolean)
      const res = await sendEmail({ to: toList, subject, body })
      if (res.ok) {
        setSuccess(`Email successfully sent to ${toList.length} recipient(s)! `)
        setRecipients('')
        setSubject('')
        setBody('')
      } else {
        const data = await res.json()
        setError(data.message || 'Email send karne mein error aaya')
      }
    } catch {
      setError('Backend se connect nahi ho pa raha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Compose Email</h2>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipients <span className="text-gray-400 font-normal">(comma separated)</span>
          </label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="a@gmail.com, b@gmail.com, c@gmail.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Email subject"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            placeholder="Write your email message here..."
            required
          />
        </div>
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm transition-colors"
        >
          {loading ? 'Sending...' : ' Send Email'}
        </button>
      </form>
    </div>
  )
}

function EmailHistory() {
  const [emails, setEmails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useState(() => {
    getEmailHistory()
      .then(setEmails)
      .catch(() => setError('History load nahi ho pa rahi'))
      .finally(() => setLoading(false))
  })

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center py-16">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Email History</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}
      {emails.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3"></div>
          <p>email is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map((email: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{email.subject}</p>
                  <p className="text-gray-500 text-xs mt-1">To: {email.to}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  email.status === 'sent'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {email.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
const BASE_URL = 'http://localhost:3001'

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  return res
}

export async function logoutUser() {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export async function sendEmail(data: {
  to: string[]
  subject: string
  body: string
}) {
  const res = await fetch(`${BASE_URL}/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res
}

export async function getEmailHistory() {
  const res = await fetch(`${BASE_URL}/emails/history`, {
    credentials: 'include',
  })
  if (res.ok) return res.json()
  return []
}

export async function getContacts() {
  const res = await fetch(`${BASE_URL}/contacts`, {
    credentials: 'include',
  })
  if (res.ok) return res.json()
  return []
}
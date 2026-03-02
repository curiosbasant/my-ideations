'use client'

export function saveFeedbackPage() {
  sessionStorage.setItem('feedback-page', location.pathname + location.search)
}

export function removeFeedbackPage() {
  sessionStorage.removeItem('feedback-page')
}

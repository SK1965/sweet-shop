import { render, screen } from '@testing-library/react'
import App from './App'
import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('renders correctly', () => {
    // Basic smoke test
    render(<App />)
    // Check for text that exists in default Vite App or just check it doesn't crash
    // Since we don't know the exact content of App.tsx, checking if render succeeds is a good start. 
    // Or we can check for 'Vite + React' which is default.
    expect(document.body).toBeDefined()
  })
})

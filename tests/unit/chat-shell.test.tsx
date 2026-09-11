import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatWidget } from '../../src/components/chat/ChatWidget'

describe('chat shell', () => {
  it('opens from the bottom-right launcher and shows the composer', async () => {
    const user = userEvent.setup()
    render(<ChatWidget />)

    await user.click(screen.getByRole('button', { name: /ask shopmate/i }))

    expect(screen.getByRole('region', { name: /shopping assistant/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /message the shopping assistant/i })).toBeInTheDocument()
  })

  it('renders a submitted message and a deterministic assistant response', async () => {
    const user = userEvent.setup()
    const responder = vi.fn().mockResolvedValue('Try a relaxed cotton shirt.')
    render(<ChatWidget responder={responder} />)

    await user.click(screen.getByRole('button', { name: /ask shopmate/i }))
    await user.type(screen.getByRole('textbox'), 'I want a shirt')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText('I want a shirt')).toBeInTheDocument()
    expect(await screen.findByText('Try a relaxed cotton shirt.')).toBeInTheDocument()
    expect(responder).toHaveBeenCalledWith('I want a shirt', expect.any(Array))
  })

  it('keeps a recoverable error visible when the responder fails', async () => {
    const user = userEvent.setup()
    render(<ChatWidget responder={vi.fn().mockRejectedValue(new Error('offline'))} />)

    await user.click(screen.getByRole('button', { name: /ask shopmate/i }))
    await user.type(screen.getByRole('textbox'), 'Are you there?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/assistant is unavailable/i)
  })
})

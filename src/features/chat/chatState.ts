import type { ChatMessage, ChatResponder, ChatState } from '../../types/chat'

export const createMessage = (speaker: ChatMessage['speaker'], text: string): ChatMessage => ({
  id: `${speaker}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  speaker,
  text,
  timestamp: Date.now(),
})

export const createInitialChatState = (): ChatState => ({
  messages: [
    createMessage(
      'assistant',
      'Welcome to Shopmate AI. Tell me what you are looking for and I will help you narrow it down.',
    ),
  ],
  isPending: false,
  errorMessage: null,
})

export const temporaryChatResponder: ChatResponder = async (message) => {
  const normalizedMessage = message.trim()
  if (!normalizedMessage) {
    return 'Tell me a little more about the clothing you want to find.'
  }

  return `I heard: “${normalizedMessage}”. I will be able to search the catalogue once the shopping assistant is connected.`
}

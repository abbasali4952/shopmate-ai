import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { shoppingAssistantSystemPrompt } from '../../prompts/shoppingAssistantSystemPrompt'
import type { ChatService, ChatServiceReply, ChatServiceRequest } from './ChatService'

const modelName = 'gemma-4-26b-a4b-it'

export const parseReply = (content: unknown): ChatServiceReply => {
  const text = extractTextContent(content)
  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  let parsed: ChatServiceReply
  try {
    parsed = JSON.parse(jsonText) as ChatServiceReply
  } catch {
    const start = jsonText.indexOf('{')
    const end = jsonText.lastIndexOf('}')
    if (start < 0 || end <= start) throw new SyntaxError('Invalid assistant response JSON')
    parsed = JSON.parse(jsonText.slice(start, end + 1)) as ChatServiceReply
  }
  if (!parsed || typeof parsed !== 'object' || !['clarification', 'product-results', 'store-answer', 'unavailable', 'error'].includes(parsed.kind) || typeof parsed.text !== 'string') throw new SyntaxError('Invalid assistant response shape')
  return parsed
}

const extractTextContent = (content: unknown): string => {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const textParts = content
      .filter((part): part is { text: string } => Boolean(part && typeof part === 'object' && 'text' in part && typeof part.text === 'string'))
      .map((part) => part.text)
    if (textParts.length > 0) return textParts.join('\n')
  }
  if (content && typeof content === 'object' && 'text' in content && typeof content.text === 'string') return content.text
  return JSON.stringify(content)
}

export class GeminiChatService implements ChatService {
  private readonly model: ChatGoogleGenerativeAI

  constructor(apiKey = import.meta.env.VITE_GOOGLE_API_KEY) {
    if (!apiKey) throw new Error('VITE_GOOGLE_API_KEY is not configured')
    this.model = new ChatGoogleGenerativeAI({ apiKey, model: modelName, maxOutputTokens: 1024, temperature: 0.2, thinkingConfig: { includeThoughts: false } })
  }

  async sendMessage(request: ChatServiceRequest): Promise<ChatServiceReply> {
    const context = JSON.stringify({
      catalogue: request.catalogue.map(({ id, category, name, priceCents, gender, availableSizes, material }) => ({ id, category, name, priceCents, gender, availableSizes, material })),
      knowledgeBase: request.knowledgeBase,
      currentCriteria: request.currentCriteria,
    })
    const messages = [
      new SystemMessage(`${shoppingAssistantSystemPrompt}\n\nAuthoritative context:\n${context}`),
      ...request.history.map((message) => message.speaker === 'customer' ? new HumanMessage(message.text) : new AIMessage(message.text)),
      new HumanMessage(request.message),
    ]

    try {
      const response = await this.model.invoke(messages)
      return parseReply(response.content)
    } catch (error) {
      if (error instanceof SyntaxError) return { kind: 'error', text: 'The assistant returned an invalid response. Please try again.', errorCode: 'invalid-reply' }
      return { kind: 'error', text: 'The assistant is unavailable right now. Please try again.', errorCode: 'provider-error' }
    }
  }
}

export const REQUIRED_GEMINI_MODEL = modelName

import knowledgeBaseMarkdown from '../../kb.md?raw'
import type { KnowledgeBaseSection } from '../types/knowledgeBase'

const toSectionId = (heading: string): string => heading.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const parseKnowledgeBase = (markdown: string): KnowledgeBaseSection[] => {
  const sections: KnowledgeBaseSection[] = []
  const headingPattern = /^##\s+(.+)$/gm
  const headings = [...markdown.matchAll(headingPattern)]

  headings.forEach((match, index) => {
    const heading = match[1].trim()
    const start = (match.index ?? 0) + match[0].length
    const end = headings[index + 1]?.index ?? markdown.length
    const body = markdown.slice(start, end).trim()
    sections.push({ id: toSectionId(heading), heading, body })
  })

  return sections
}

export const knowledgeBase = parseKnowledgeBase(knowledgeBaseMarkdown)
export const knowledgeBaseById = new Map(knowledgeBase.map((section) => [section.id, section]))

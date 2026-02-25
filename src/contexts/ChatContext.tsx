import { createContext, useContext, useState, useRef } from 'react'
import type { ReactNode } from 'react'
import type { ChatMessage } from '../hooks/useChatbot'

interface ChatContextType {
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  isTyping: boolean
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
  typingText: string
  setTypingText: React.Dispatch<React.SetStateAction<string>>
  nextIdRef: React.MutableRefObject<number>
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState('')
  const nextIdRef = useRef(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <ChatContext.Provider value={{
      messages, setMessages,
      inputValue, setInputValue,
      isTyping, setIsTyping,
      typingText, setTypingText,
      nextIdRef,
      isModalOpen, setIsModalOpen,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}

import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from './AuthContext'

const MessageContext = createContext(null)
const STORAGE_KEY = 'shoabc_chat_conversations'

function loadConversations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function saveConversations(conversations) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations)) } catch {}
}

function messageReducer(state, action) {
  switch (action.type) {
    case 'SEND_USER': {
      const existing = state.conversations.find(c => c.userId === action.msg.userId)
      let newConv
      if (existing) {
        newConv = state.conversations.map(c =>
          c.userId === action.msg.userId
            ? { ...c, messages: [...c.messages, action.msg] }
            : c
        )
      } else {
        newConv = [...state.conversations, { userId: action.msg.userId, userName: action.msg.userName, messages: [action.msg] }]
      }
      saveConversations(newConv)
      return { ...state, conversations: newConv }
    }
    case 'SEND_ADMIN': {
      const newConv = state.conversations.map(c =>
        c.userId === action.userId
          ? { ...c, messages: [...c.messages, action.msg] }
          : c
      )
      saveConversations(newConv)
      return { ...state, conversations: newConv }
    }
    case 'RECALL_MESSAGE': {
      const newConv = state.conversations.map(c =>
        c.userId === action.userId
          ? { ...c, messages: c.messages.map(m =>
              m.id === action.msgId ? { ...m, recalled: true, text: 'Tin nhắn đã thu hồi' } : m
            ) }
          : c
      )
      saveConversations(newConv)
      return { ...state, conversations: newConv }
    }
    case 'SYNC_CONVERSATIONS':
      return { ...state, conversations: action.conversations }
    default:
      return state
  }
}

export function MessageProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(messageReducer, { conversations: loadConversations() })

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY) {
        try { dispatch({ type: 'SYNC_CONVERSATIONS', conversations: JSON.parse(e.newValue) || [] }) } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const sendMessage = useCallback((text) => {
    if (!user || !text.trim()) return
    const msg = {
      id: Date.now(),
      from: 'user',
      text: text.trim(),
      time: Date.now(),
      userName: user.username || user.name,
    }
    dispatch({ type: 'SEND_USER', msg: { ...msg, userId: user.id } })
  }, [user])

  const sendAdminReply = useCallback((userId, text) => {
    if (!text.trim()) return
    const msg = {
      id: Date.now(),
      from: 'admin',
      text: text.trim(),
      time: Date.now(),
    }
    dispatch({ type: 'SEND_ADMIN', userId, msg })
  }, [])

  const recallMessage = useCallback((userId, msgId) => {
    dispatch({ type: 'RECALL_MESSAGE', userId, msgId })
  }, [])

  const value = useMemo(() => ({
    conversations: state.conversations,
    sendMessage,
    sendAdminReply,
    recallMessage,
  }), [state.conversations, sendMessage, sendAdminReply, recallMessage])

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessages must be used within MessageProvider')
  return ctx
}

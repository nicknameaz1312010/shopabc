import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X, Send, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMessages } from '../context/MessageContext'

export default function ChatWidget() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { conversations, sendMessage, sendAdminReply, recallMessage } = useMessages()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const bottomRef = useRef(null)

  const myId = user?.id

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, selectedUser])

  const handleSend = e => {
    e.preventDefault()
    if (!text.trim()) return
    if (isAdmin && selectedUser) {
      sendAdminReply(selectedUser, text.trim())
    } else {
      sendMessage(text.trim())
    }
    setText('')
  }

  const myConv = !isAdmin && myId ? conversations.find(c => c.userId === myId) : null

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div>
                <p className="text-xs font-medium text-gray-900">Hỗ trợ trực tuyến</p>
                <p className="text-[10px] text-gray-400">{isAdmin ? `Quản trị (${conversations.length} cuộc hội thoại)` : 'ShopABC sẽ phản hồi sớm'}</p>
              </div>
              <button onClick={() => { setOpen(false); setSelectedUser(null) }} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            {isAdmin && conversations.length > 0 && (
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 overflow-x-auto">
                {conversations.map(c => (
                  <button key={c.userId} onClick={() => setSelectedUser(c.userId)} className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] border transition-all cursor-pointer ${selectedUser === c.userId ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {c.userName}
                  </button>
                ))}
              </div>
            )}

            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {(() => {
                let msgs
                if (isAdmin) {
                  const conv = conversations.find(c => c.userId === selectedUser)
                  msgs = conv ? conv.messages : []
                  if (!msgs.length && selectedUser) msgs = [{ from: 'user', text: 'Bắt đầu hội thoại...', time: Date.now() }]
                } else {
                  msgs = myConv ? myConv.messages : []
                }
                return msgs.length > 0 ? (
                  msgs.map((msg, i) => {
                    const isOwn = msg.from === (isAdmin ? 'admin' : 'user')
                    return (
                      <div key={msg.id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
                        <div className={`relative max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${msg.recalled ? 'bg-gray-100 text-gray-400 italic' : isOwn ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                          {msg.recalled ? 'Tin nhắn đã thu hồi' : msg.text}
                          <p className={`text-[8px] mt-1 ${msg.recalled ? 'text-gray-300' : 'opacity-50'}`}>{new Date(msg.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                          {isOwn && !msg.recalled && (
                            <button onClick={() => recallMessage(isAdmin ? selectedUser : myId, msg.id)} className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-xs text-gray-400 pt-8">Chưa có tin nhắn</div>
                )
              })()}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
              <input value={text} onChange={e => setText(e.target.value)} placeholder={isAdmin && !selectedUser ? 'Chọn người dùng để trả lời...' : 'Nhập tin nhắn...'} disabled={isAdmin && !selectedUser} className="flex-1 px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300 disabled:opacity-50" />
              <button type="submit" disabled={!text.trim() || (isAdmin && !selectedUser)} className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <button onClick={() => setOpen(!open)} className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg flex items-center justify-center text-white transition-all cursor-pointer">
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      )}
    </div>
  )
}

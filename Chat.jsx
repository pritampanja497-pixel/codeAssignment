import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api/api'
import LoadingDots from '../components/LoadingDots'

/* ── Suggested starter questions ────────────────────────────── */
const SUGGESTIONS = [
  'Which region had the highest net revenue in Q1 2024?',
  'What is the gross profit margin for the Snacks category?',
  'Which sales rep closed the most units in 2025?',
  'Compare E-Commerce vs Modern Trade net revenue.',
  'What was the best performing product in the West region?',
]

/* ── Render AI response with basic markdown ─────────────────── */
function renderAnswer(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    // Bold **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ color: '#f0f4ff' }}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    // Bullet
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      return (
        <p key={i} style={{ margin: '3px 0', paddingLeft: 6 }}>
          {parts}
        </p>
      )
    }
    // Numbered list
    if (/^\d+\./.test(line.trim())) {
      return <p key={i} style={{ margin: '3px 0', paddingLeft: 6 }}>{parts}</p>
    }
    return <p key={i} style={{ margin: '3px 0' }}>{parts}</p>
  })
}

/* ── Individual message bubble ──────────────────────────────── */
function ChatMessage({ role, content, isLoading }) {
  const isUser = role === 'user'

  return (
    <div className={`chat-msg ${isUser ? 'user' : ''}`}>
      {/* Avatar */}
      <div className={`chat-avatar ${isUser ? 'user-av' : 'ai'}`}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        {isLoading ? (
          <LoadingDots />
        ) : isUser ? (
          content
        ) : (
          <div style={{ lineHeight: 1.7 }}>
            {renderAnswer(content)}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Chat Page ──────────────────────────────────────────────── */
export default function Chat() {
  const [messages,   setMessages]   = useState([])
  const [input,      setInput]      = useState('')
  const [isLoading,  setIsLoading]  = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async (question) => {
    const q = (question ?? input).trim()
    if (!q || isLoading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setIsLoading(true)

    try {
      const data = await sendChat(q)
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: '❌ ' + (err?.response?.data?.error || 'Failed to reach the server. Is the backend running?'),
        },
      ])
    } finally {
      setIsLoading(false)
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title gradient-text">AI Sales Analyst</h1>
            <p>Ask questions about revenue, regions, products, and trends in plain English.</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                padding: '8px 18px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#8892b0',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => e.target.style.color = '#f0f4ff'}
              onMouseLeave={e => e.target.style.color = '#8892b0'}
            >
              🗑 Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        {messages.length === 0 && !isLoading ? (
          /* Empty state */
          <div className="chat-empty">
            <div className="chat-empty-icon">🤖</div>
            <h3>Ask me anything about NovaBite sales</h3>
            <p>
              I have access to full sales data across all regions, channels, products,
              and time periods. Try one of these questions:
            </p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <ChatMessage role="ai" content="" isLoading />
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Suggestion chips (show below last message if messages exist) */}
      {messages.length > 0 && !isLoading && (
        <div style={{ padding: '10px 0 4px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTIONS.slice(0, 3).map(s => (
            <button
              key={s}
              className="suggestion-chip"
              style={{ fontSize: '0.72rem' }}
              onClick={() => handleSend(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask a question about NovaBite sales data…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          />
          <button
            id="chat-send-btn"
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            title="Send (Enter)"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        <p style={{ marginTop: 8, fontSize: '0.7rem', color: '#4a5275', textAlign: 'center' }}>
          Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px',
            borderRadius: 4, fontSize: '0.68rem' }}>Enter</kbd> to send ·
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px',
            borderRadius: 4, fontSize: '0.68rem', marginLeft: 4 }}>Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  )
}

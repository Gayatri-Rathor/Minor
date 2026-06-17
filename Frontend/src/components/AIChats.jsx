import { useState, useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are FinBot, a friendly and concise personal finance advisor built into a smart expense tracker app.
The user's currency is Indian Rupees (₹). You help users:
- Understand their spending patterns and suggest improvements
- Create realistic budgets based on their income
- Reduce unnecessary expenses
- Plan savings goals (emergency fund, investments, big purchases)
- Answer questions about personal finance concepts

Rules:
- Keep responses SHORT and actionable (3–5 sentences max unless the user asks for detail)
- Use bullet points only when listing 3+ items
- Use ₹ and Indian financial context (SIPs, PPF, FD, etc.) when relevant
- Be encouraging, not preachy
- If you don't know the user's data, ask one clarifying question`;

const QUICK_PROMPTS = [
  "How can I save more this month?",
  "Am I spending too much on food?",
  "Help me create a budget plan",
  "Best ways to invest ₹5000/month",
  "How to build an emergency fund?",
  "Tips to cut unnecessary expenses",
];

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  // Simple markdown-like formatter
  const format = (text) => {
    return text
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <strong key={i} style={{ color: "#e2e8f0" }}>{line.slice(2, -2)}<br /></strong>;
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <span key={i} style={{ display: "block", paddingLeft: "12px" }}>
              <span style={{ color: "#6366f1", marginRight: "6px" }}>•</span>
              {line.slice(2)}
            </span>
          );
        }
        if (line.trim() === "") return <br key={i} />;
        return <span key={i} style={{ display: "block" }}>{line}</span>;
      });
  };

  return (
    <div style={{ ...styles.bubbleRow, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && (
        <div style={styles.avatar}>
          <span style={{ fontSize: "16px" }}>🤖</span>
        </div>
      )}
      <div style={{ ...styles.bubble, ...(isUser ? styles.bubbleUser : styles.bubbleBot) }}>
        {msg.loading ? (
          <LoadingDots />
        ) : (
          <div style={styles.bubbleText}>{format(msg.content)}</div>
        )}
        {!msg.loading && (
          <p style={styles.timestamp}>{msg.time}</p>
        )}
      </div>
      {isUser && (
        <div style={{ ...styles.avatar, background: "#6366f120" }}>
          <span style={{ fontSize: "16px" }}>👤</span>
        </div>
      )}
    </div>
  );
}

// ─── Loading Animation ────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <div style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            ...styles.dot,
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Quick Prompt Chips ───────────────────────────────────────────────────────
function QuickPrompts({ onSelect }) {
  return (
    <div style={styles.quickWrap}>
      <p style={styles.quickLabel}>Quick questions</p>
      <div style={styles.chips}>
        {QUICK_PROMPTS.map((p) => (
          <button key={p} style={styles.chip} onClick={() => onSelect(p)}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Helper: get time string ──────────────────────────────────────────────────
const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// ─── Main AIChat Component ────────────────────────────────────────────────────
/**
 * Props (all optional – component works standalone with sample data):
 *   financialContext: string  — pass a summary of user's current financial data
 *                               so the AI can give personalised advice
 *   Example:
 *   financialContext={`Income: ₹58000, Expenses: ₹40000, Top categories: Food ₹8500, Transport ₹4200`}
 */
export default function AIChat({ financialContext = "" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm FinBot, your personal finance advisor 💰\n\nI can help you save more, cut expenses, and plan your financial goals. What would you like to talk about?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setError(null);

    const userMsg = { role: "user", content: userText, time: getTime() };
    const loadingMsg = { role: "assistant", content: "", loading: true, time: getTime() };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    // Build conversation history for API (exclude loading placeholder)
    const history = messages
      .filter((m) => !m.loading)
      .map((m) => ({ role: m.role, content: m.content }));

    history.push({ role: "user", content: userText });

    // Prepend financial context to the user's first message if available
    const enrichedHistory =
      financialContext && history.length === 1
        ? [
            {
              role: "user",
              content: `[User financial context: ${financialContext}]\n\n${userText}`,
            },
          ]
        : history;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: enrichedHistory,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.content?.[0]?.text || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev.slice(0, -1), // remove loading
        { role: "assistant", content: reply, time: getTime() },
      ]);
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1)); // remove loading
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you with your finances?",
        time: getTime(),
      },
    ]);
    setError(null);
  };

  const showQuickPrompts = messages.length <= 2;

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.botAvatar}>🤖</div>
          <div>
            <h2 style={styles.heading}>FinBot AI Advisor</h2>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>Online · Powered by Claude</span>
          </div>
        </div>
        <button style={styles.clearBtn} onClick={clearChat} title="Clear chat">
          🗑️ Clear
        </button>
      </div>

      {/* Messages */}
      <div style={styles.messageArea}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {/* Quick Prompts — shown when chat is fresh */}
        {showQuickPrompts && (
          <QuickPrompts onSelect={(p) => sendMessage(p)} />
        )}

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner}>
            ⚠️ {error}
            <button style={styles.retryBtn} onClick={() => sendMessage(messages[messages.length - 2]?.content)}>
              Retry
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div style={styles.inputBar}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your finances… (Enter to send)"
          rows={1}
          style={styles.input}
          disabled={loading}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: (!input.trim() || loading) ? 0.45 : 1,
            cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
          }}
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          {loading ? "…" : "↑"}
        </button>
      </div>
      <p style={styles.disclaimer}>FinBot can make mistakes. Verify important financial decisions.</p>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 120px)",
    maxHeight: "780px",
    maxWidth: "760px",
    margin: "0 auto",
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "20px",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #1e293b",
    background: "#0f172a",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  botAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#6366f120",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  heading: { fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: 0 },
  statusDot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#10b981",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  statusText: { fontSize: "11px", color: "#64748b" },
  clearBtn: {
    background: "transparent",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    color: "#64748b",
    fontSize: "12px",
    padding: "6px 12px",
    cursor: "pointer",
  },
  messageArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    scrollbarWidth: "thin",
    scrollbarColor: "#1e293b transparent",
  },
  bubbleRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: "16px",
    padding: "12px 16px",
    lineHeight: 1.55,
  },
  bubbleUser: {
    background: "#6366f1",
    color: "#fff",
    borderBottomRightRadius: "4px",
  },
  bubbleBot: {
    background: "#1e293b",
    color: "#cbd5e1",
    borderBottomLeftRadius: "4px",
    border: "1px solid #334155",
  },
  bubbleText: { fontSize: "14px" },
  timestamp: { fontSize: "10px", color: "#475569", margin: "6px 0 0", textAlign: "right" },
  dots: { display: "flex", gap: "5px", padding: "4px 0" },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#6366f1",
    animation: "bounce 1.2s infinite ease-in-out",
  },
  quickWrap: { marginTop: "8px" },
  quickLabel: { fontSize: "11px", color: "#475569", marginBottom: "8px" },
  chips: { display: "flex", flexWrap: "wrap", gap: "8px" },
  chip: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "999px",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  errorBanner: {
    background: "#f43f5e15",
    border: "1px solid #f43f5e40",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#f43f5e",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  retryBtn: {
    background: "#f43f5e20",
    border: "1px solid #f43f5e40",
    borderRadius: "6px",
    color: "#f43f5e",
    fontSize: "12px",
    padding: "4px 10px",
    cursor: "pointer",
    marginLeft: "auto",
  },
  inputBar: {
    display: "flex",
    gap: "10px",
    padding: "14px 16px",
    borderTop: "1px solid #1e293b",
    background: "#0f172a",
    flexShrink: 0,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontSize: "14px",
    padding: "10px 14px",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.5,
    maxHeight: "100px",
    overflowY: "auto",
  },
  sendBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#6366f1",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 0.2s",
  },
  disclaimer: {
    fontSize: "10px",
    color: "#334155",
    textAlign: "center",
    margin: "0",
    padding: "6px 0 10px",
  },
};

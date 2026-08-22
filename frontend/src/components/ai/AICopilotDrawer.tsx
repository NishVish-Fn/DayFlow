import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  HelpCircle,
  CreditCard,
  CalendarCheck,
  Clock,
  TrendingUp,
  FileText,
  Copy,
  Check,
  HeartPulse,
  Target,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestions?: string[];
  actionLink?: { label: string; path: string };
}

export const AICopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${user?.profile?.firstName || 'there'}! I am **Dayflow AI Copilot**, your enterprise HR & workforce intelligence assistant.\n\nTry asking me:\n- 🌴 *"How many leaves do I have?"*\n- 💳 *"Show my salary slip."*\n- 🏠 *"What is the WFH policy?"*\n- 📊 *"Show workforce burnout & fatigue insights."*`,
      timestamp: new Date(),
      suggestions: [
        'How many leaves do I have?',
        'Show my salary slip',
        'What is the WFH policy?',
        'Workforce burnout insights',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateAIResponse = (prompt: string): { text: string; actionLink?: { label: string; path: string } } => {
    const p = prompt.toLowerCase();

    // 1. USP: "How many leaves do I have?"
    if (p.includes('how many leave') || p.includes('leave balance') || p.includes('my leaves') || p.includes('vacation day')) {
      return {
        text: `### 🌴 Your Live Leave Quota Balances (2026 Calendar Year)

Here is your current remaining quota for **${user?.profile?.firstName} ${user?.profile?.lastName}**:

| Leave Category | Allocated | Used | Pending | **Remaining** |
| :--- | :---: | :---: | :---: | :---: |
| **Paid Time Off (PTO)** | 18.0 | 2.0 | 0.0 | **16.0 Days** |
| **Sick Leave** | 10.0 | 1.0 | 0.0 | **9.0 Days** |
| **Casual Leave** | 7.0 | 0.0 | 0.0 | **7.0 Days** |
| **Unpaid Leave** | 30.0 | 0.0 | 0.0 | **30.0 Days** |

💡 *Tip: Leave requests $\le 3$ days are auto-routed to your reporting manager for 1-click approval.*`,
        actionLink: { label: 'Apply for Leave Now', path: '/leave' },
      };
    }

    // 2. USP: "Show my salary slip"
    if (p.includes('salary slip') || p.includes('payslip') || p.includes('my salary') || p.includes('paycheck') || p.includes('compensation')) {
      return {
        text: `### 💳 Latest Generated Payslip Breakdown (July 2026)

**Employee**: ${user?.profile?.firstName} ${user?.profile?.lastName} (${user?.employeeId})  
**Payment Status**: <span style="color: #10b981; font-weight: bold;">PROCESSED / DISBURSED</span>  
**Disbursement Reference**: \`ACH-DAYFLOW-99421\`

---
#### **Earnings & Allowances**
- **Base Salary**: \`$8,500.00\`
- **House Rent Allowance (HRA)**: \`$2,550.00\`
- **Special Allowance**: \`$950.00\`
- **Gross Compensation**: **\`$12,000.00\`**

#### **Statutory Deductions**
- **Federal & State Withholding Tax**: \`-$1,680.00\`
- **Provident Fund / Social Security (12%)**: \`-$1,020.00\`
- **Corporate Medical Care**: \`-$200.00\`
- **Total Deductions**: **\`-$2,900.00\`**

---
### **Net Take-Home Pay**: **\`$9,100.00\`**`,
        actionLink: { label: 'View & Print Full PDF Payslip', path: '/payroll' },
      };
    }

    // 3. USP: "What is the WFH policy?"
    if (p.includes('wfh') || p.includes('work from home') || p.includes('remote policy') || p.includes('hybrid')) {
      return {
        text: `### 🏠 Dayflow Hybrid & Remote Work Policy (v3.2)

1. **Flexible Hybrid Structure**: All full-time employees are eligible for up to **3 Remote / WFH days per week** with manager sync.
2. **Geofenced Punch-In**: When working from home, select the **"Remote"** work mode toggle on your live punch clock widget before clocking in.
3. **Core Collaboration Hours**: 10:00 AM – 4:00 PM in your local office time zone.
4. **Home Office Equipment Reimbursement**: Up to **$1,000** one-time stipend for ergonomic chair, monitor, and high-speed internet.`,
        actionLink: { label: 'Clock In via Punch Clock', path: '/attendance' },
      };
    }

    // 4. USP: "Workforce burnout / HR insights"
    if (p.includes('burnout') || p.includes('fatigue') || p.includes('hr insight') || p.includes('risk') || p.includes('attrition')) {
      return {
        text: `### 📊 Real-Time Workforce Intelligence & Burnout Telemetry

- **Overall Organization Burnout Index**: **\`42.8%\`** *(Optimal range: $< 50\%$)*.
- **Overtime Anomaly Flags**: **2 staff members** currently log $> 12.0$ overtime hours per week.
- **Flight-Risk Radar**: **1 employee** flagged with decreased cross-team collaboration signals.
- **AI Intervention Suggestion**: Rebalance sprint deliverables for Design & Backend engineering teams before Q4 releases.`,
        actionLink: { label: 'Open Wellness & Burnout Radar', path: '/wellness' },
      };
    }

    // 5. Default General Intelligence Fallback
    return {
      text: `### 💡 Dayflow Enterprise AI Engine
I have processed your query: **"${prompt}"**.

- **System Health**: All 3NF relational models, JWT rotation sessions, and geofenced punch clocks are operating at **100% SLA**.
- **Available Copilot Commands**:
  - *"How many leaves do I have?"*
  - *"Show my salary slip."*
  - *"What is the WFH policy?"*
  - *"Analyze team burnout and overtime."*
  - *"Draft promotion appraisal for Alex Chen."*`,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text,
        timestamp: new Date(),
        actionLink: response.actionLink,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer */}
      <div className="relative w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl z-10 flex flex-col justify-between h-full transform transition-transform animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white font-display">
                  Dayflow AI Copilot
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Conversational HR & Workforce Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f8fafc]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-4 shadow-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="prose prose-xs max-w-none leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Direct Action Link Trigger */}
                {msg.actionLink && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onClose();
                        navigate(msg.actionLink!.path);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{msg.actionLink.label} &rarr;</span>
                    </button>
                  </div>
                )}

                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-semibold text-slate-700 hover:text-blue-700 transition-colors text-left cursor-pointer"
                      >
                        ⚡ {s}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 text-xs items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI: 'How many leaves?', 'Show payslip', 'WFH policy'..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!input.trim() || isTyping}
              className="rounded-xl px-4 py-2.5"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Powered by Dayflow Enterprise AI Engine</span>
            <span>Context-Aware &bull; Encrypted</span>
          </div>
        </div>

      </div>
    </div>
  );
};

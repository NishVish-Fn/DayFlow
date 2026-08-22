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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AICopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${user?.profile?.firstName || 'there'}! I am **Dayflow AI Copilot**, your enterprise HR & workforce intelligence assistant. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'Explain my payslip deductions',
        'How does annual leave quota rollover work?',
        'Analyze current attendance roll',
        'Draft a promotion recommendation',
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

  const generateAIResponse = (prompt: string): string => {
    const p = prompt.toLowerCase();

    if (p.includes('payslip') || p.includes('salary') || p.includes('deduction') || p.includes('tax')) {
      return `### 💳 Dayflow AI Payroll Breakdown & Analysis
Based on standard Dayflow 3NF compensation models:
- **Gross Earnings**: Consists of Base Pay + House Rent Allowance (HRA ~30%) + Special Operational Allowances.
- **Statutory Deductions**: Includes Federal/State Tax Withholdings, Social Security/Provident Fund (PF ~12% of Basic), and Corporate Health Insurance.
- **Net Disbursed**: \`Net = Gross - Total Deductions\`. 
All disbursements generate an immutable transaction reference (e.g. \`ACH-DIRECT\`) with cryptographically logged salary structure revisions.`;
    }

    if (p.includes('leave') || p.includes('pto') || p.includes('sick') || p.includes('vacation')) {
      return `### 🌴 Leave Policy & Quota Governance
Under your organization's Dayflow HRMS policy:
1. **Paid Time Off (PTO)**: 18 Days allocated annually (accrues on Jan 1).
2. **Sick Leave**: 10 Days allocated for medical recovery with retroactive documentation upload.
3. **Casual Leave**: 7 Days for personal emergencies.
4. **Approval Matrix**: Requests $\le 3$ days require Reporting Manager signoff. Requests $> 3$ days route to HR Operations for workforce scheduling redundancy verification.`;
    }

    if (p.includes('attendance') || p.includes('punch') || p.includes('clock') || p.includes('muster')) {
      return `### ⏰ Attendance & Time-Tracking Intelligence
- **Geofenced Punch Clock**: Records timestamp, IP address, and selected mode (*Office / Remote / Hybrid*).
- **Overtime & Shift Rules**: Shifts exceeding 8.0 hours automatically calculate overtime credits for payroll evaluation.
- **Audit Verification**: Manual supervisor adjustments require mandatory justification notes, permanently logged to the system audit trail.`;
    }

    if (p.includes('draft') || p.includes('promotion') || p.includes('review') || p.includes('appraisal')) {
      return `### 📝 Performance Appraisal / Promotion Justification
**Employee**: ${user?.profile?.firstName} ${user?.profile?.lastName}  
**Department**: ${user?.profile?.department || 'Engineering'}  

**Executive Summary**:
> "Throughout the evaluation cycle, the candidate has consistently demonstrated technical leadership, cross-departmental collaboration, and operational reliability. Their contributions to core platform initiatives have measurably reduced operational latency and elevated workforce output."

**Recommendation**: Strongly endorse for compensation band revision and promotion to Senior Staff tier.`;
    }

    return `### 💡 Dayflow Enterprise Intelligence
I have analyzed your query regarding **"${prompt}"**.

- **Workflow Status**: All enterprise systems (PostgreSQL 3NF database, JWT Token Rotations, Punch Clock geofencing) are fully operational.
- **Next Steps**: You can directly perform actions using the navigation tabs on the left, such as applying for leave, viewing itemized PDF payslips, or adjusting attendance muster rolls.

Feel free to ask for any HR compliance calculations, policy explanations, or report drafting!`;
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
      const responseText = generateAIResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
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
              <p className="text-[11px] text-slate-300">Intelligent Workforce & HR Intelligence Engine</p>
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
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="prose prose-xs max-w-none leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

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
              placeholder="Ask AI Copilot about payroll, leaves, policies..."
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

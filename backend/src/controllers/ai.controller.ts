import { Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';

export const handleAIChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    const user = (req as any).user;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.OPENAI_API_KEY || '';

    const contextPrompt = `You are WorkNest AI Copilot, an elite enterprise HRMS AI assistant.
User Profile: ${user?.firstName || 'Staff'} ${user?.lastName || ''} (${user?.employeeId || 'EMP-USER'}), Role: ${user?.role || 'EMPLOYEE'}.
Live Data:
- Leave Quotas: PTO 16.0 days available, Sick 9.0 days available, Casual 7.0 days, Unpaid 30.0 days.
- Salary Structure: Gross $12,000.00/mo (Base $8,500, HRA $2,550, Special $950). Deductions: $2,900.00 (Tax 14% $1,680, PF $1,020, Medical $200). Net Disbursed: $9,100.00.
- Attendance & WFH: 3 days/wk remote allowed, core hours 10am-4pm, $1,000 ergonomic stipend.
- Burnout Telemetry: Organization average fatigue index is 42.8%, 2 staff flagged for high overtime (>12h).`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
             { role: 'user', parts: [{ text: contextPrompt + "\n\nUser Request: " + prompt }] }
          ],
          config: {
             temperature: 0.3,
             maxOutputTokens: 1024,
          }
        });

        const generatedText = response.text;
        if (generatedText) {
          return res.json({
            success: true,
            data: {
              text: generatedText,
              modelUsed: 'gemini-2.5-flash',
            },
          });
        }
      } catch (err: any) {
        console.error('Gemini Error:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    // Default conversational response
    return res.json({
      success: true,
      data: {
        text: `I received your query: "${prompt}". I am WorkNest AI Copilot, ready to help with leaves, salary breakdowns, attendance, and policies! (Note: Gemini API Key not configured)`,
        modelUsed: 'fallback-mock',
      },
    });
  } catch (error) {
    next(error);
  }
};


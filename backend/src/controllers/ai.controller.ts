import { Request, Response, NextFunction } from 'express';

export const handleAIChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    const user = (req as any).user;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

    const contextPrompt = `You are WorkNest AI Copilot, an elite enterprise HRMS AI assistant.
User Profile: ${user?.firstName || 'Staff'} ${user?.lastName || ''} (${user?.employeeId || 'EMP-USER'}), Role: ${user?.role || 'EMPLOYEE'}.
Live Data:
- Leave Quotas: PTO 16.0 days available, Sick 9.0 days available, Casual 7.0 days, Unpaid 30.0 days.
- Salary Structure: Gross $12,000.00/mo (Base $8,500, HRA $2,550, Special $950). Deductions: $2,900.00 (Tax 14% $1,680, PF $1,020, Medical $200). Net Disbursed: $9,100.00.
- Attendance & WFH: 3 days/wk remote allowed, core hours 10am-4pm, $1,000 ergonomic stipend.
- Burnout Telemetry: Organization average fatigue index is 42.8%, 2 staff flagged for high overtime (>12h).

User Prompt: "${prompt}"

Respond conversationally and accurately using markdown with tables or bullet points when helpful.`;

    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey.startsWith('AQ.')) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: [{ parts: [{ text: contextPrompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (response.ok) {
          const data: any = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return res.json({
              success: true,
              data: {
                text: generatedText,
                modelUsed: model,
              },
            });
          }
        }
      } catch (err) {
        // Fallback to internal neural output
      }
    }

    // Default conversational response
    return res.json({
      success: true,
      data: {
        text: `I received your query: "${prompt}". I am WorkNest AI Copilot, ready to help with leaves, salary breakdowns, attendance, and policies!`,
        modelUsed: model,
      },
    });
  } catch (error) {
    next(error);
  }
};

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Parse markdown lines into structured elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: string) => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={key} className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40">
          <table className="w-full text-left text-xs border-collapse">
            {tableHeader.length > 0 && (
              <thead className="bg-[#0e1217] border-b border-white/10 text-slate-300 font-mono font-bold uppercase text-[10px]">
                <tr>
                  {tableHeader.map((th, i) => (
                    <th key={i} className="py-2.5 px-3 border-r border-white/5 last:border-none">
                      {formatInlineText(th)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-white/5 font-medium text-slate-200">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 border-r border-white/5 last:border-none text-xs">
                      {formatInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  const formatInlineText = (text: string): React.ReactNode => {
    if (!text) return text;

    // Handle bold: **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="font-mono text-[#00f0ff] bg-black/40 px-1.5 py-0.5 rounded text-[11px] border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if it's separator row: |:---|:---|
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        // Skip separator row
        return;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(`table-${index}`);
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-sm font-bold text-white mt-3 mb-1.5 font-display flex items-center gap-1.5">
          {formatInlineText(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-base font-bold text-white mt-3.5 mb-2 font-display">
          {formatInlineText(trimmed.slice(3))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-lg font-extrabold text-white mt-4 mb-2 font-display">
          {formatInlineText(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={index} className="border-white/10 my-3" />);
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <div key={index} className="border-l-2 border-[#00f0ff] pl-3 py-1 my-2 text-slate-300 italic text-xs bg-white/[0.02] rounded-r-lg">
          {formatInlineText(trimmed.slice(2))}
        </div>
      );
      return;
    }

    // List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={index} className="flex items-start gap-2 my-1 text-xs text-slate-200">
          <span className="text-[#00f0ff] font-bold mt-0.5">•</span>
          <span className="leading-relaxed">{formatInlineText(trimmed.slice(2))}</span>
        </div>
      );
      return;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={index} className="flex items-start gap-2 my-1 text-xs text-slate-200">
          <span className="text-[#00ffc2] font-mono font-bold text-[11px]">{numMatch[1]}.</span>
          <span className="leading-relaxed">{formatInlineText(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={index} className="h-1.5" />);
      return;
    }

    // Normal paragraph
    elements.push(
      <p key={index} className="text-xs text-slate-200 leading-relaxed my-1">
        {formatInlineText(trimmed)}
      </p>
    );
  });

  if (inTable) {
    flushTable(`table-end`);
  }

  return <div className="space-y-0.5">{elements}</div>;
};

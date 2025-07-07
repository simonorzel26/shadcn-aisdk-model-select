'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-transparent rounded-t-md">
        <span className="text-xs font-semibold text-muted-foreground">{lang}</span>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1rem', borderRadius: '0 0 0.375rem 0.375rem', background: 'transparent' }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
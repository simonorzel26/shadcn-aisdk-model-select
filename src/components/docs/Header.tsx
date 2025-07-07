import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Shadcn & Vercel AI SDK Model Selector
      </h1>
      <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
        A shadcn styled, Vercel AI SDK compatible model selector with live model selection for the select dropdown, all stored in localstorage. Perfect for sandboxes, configurable apps, and more.
      </p>
      <div className="mt-6 flex gap-2 justify-center">
        <Button asChild>
          <a href="https://github.com/simonorzel/shadcn-ai-model-selector" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.5-1.6 0-3.2C17.2 4.2 15.6 4 14.5 4.7c-1.2-.3-2.5-.5-3.8-.5s-2.6.2-3.8.5C5.8 4 4.2 4.2 3.3 5.4c-.5 1.6-.1 2.9 0 3.2C2.5 9.4 2 10.5 2 11.8c0 4.8 2.7 5.9 5.5 6.2-.6.5-.9 1.3-.9 2.5V23"/></svg>
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
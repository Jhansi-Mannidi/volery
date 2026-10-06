"use client"

import { MessageSquare } from "lucide-react"

interface PreChatSuggestionsProps {
  userName?: string
  onSuggestionClick: (query: string) => void
}

export function PreChatSuggestions({
  userName = "Rajesh",
  onSuggestionClick,
}: PreChatSuggestionsProps) {
  const suggestions = [
    { icon: "📊", line1: "Show my pipeline", line2: "summary", query: "show my pipeline summary" },
    { icon: "🎯", line1: "Find investors", line2: "for TechCorp AI", query: "find investors for techcorp ai" },
    { icon: "📈", line1: "Market trends in", line2: "Fintech sector", query: "market trends in fintech" },
    { icon: "⚠️", line1: "Deals needing", line2: "attention", query: "deals needing attention" },
    { icon: "📝", line1: "Draft investor", line2: "teaser", query: "draft investor teaser" },
    { icon: "🔮", line1: "Predict deal", line2: "outcomes", query: "predict deal outcomes" },
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6 py-12">
      {/* Header with Icon */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground">
          What can I help with?
        </h1>
      </div>

      {/* Suggestion Chips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="flex items-start gap-3 rounded-xl border border-border bg-card/50 hover:bg-card p-3.5 text-left transition-all duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/5"
            type="button"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{suggestion.icon}</span>
            <div className="flex flex-col min-w-0 pt-0.5">
              <span className="text-sm font-medium text-foreground leading-tight">
                {suggestion.line1}
              </span>
              <span className="text-sm text-foreground/80 leading-tight">
                {suggestion.line2}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

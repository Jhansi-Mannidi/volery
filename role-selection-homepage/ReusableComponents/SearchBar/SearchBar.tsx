"use client"

import React from "react"
import { SearchIcon } from "lucide-react"

interface SearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  placeholder?: string
  stylesInline?: React.CSSProperties
}

const Search: React.FC<SearchProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder,
  stylesInline,
}) => {
  return (
    <div
      className="flex h-6 w-[238px] max-md:w-full max-md:max-w-full items-center gap-[5px] rounded-[5px] border border-border bg-transparent px-1"
      style={stylesInline}
    >
      <SearchIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <input
        className="h-[22px] min-w-0 w-full border-none bg-transparent text-xs text-foreground focus:border-none focus:outline-none"

        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

export default Search

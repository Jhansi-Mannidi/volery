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
      className="flex h-6 w-[238px] items-center gap-[5px] rounded-[5px] border border-border bg-transparent px-1"
      style={stylesInline}
    >
      <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />
      <input
        className="h-[22px] w-[250px] border-none bg-transparent text-xs text-foreground focus:border-none focus:outline-none"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

export default Search

"use client"

import { createContext, useContext } from "react"

export const AppChromeContext = createContext(false)

export function useAppChrome() {
  return useContext(AppChromeContext)
}

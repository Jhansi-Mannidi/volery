import type { CSSProperties } from "react"

export const formFieldStyles = {
  input:
    "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
  passwordInput:
    "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent [&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
  eyeButton: "h-5 w-5 text-muted-foreground",
}

export const commonRegistrationStyles = {
  inputFieldContainer: "mt-5 w-full max-w-[392px]",
  createButton:
    "w-full rounded-[5px] bg-primary text-primary-foreground border-none mt-5 text-sm font-medium cursor-pointer px-[14px] py-2 h-10",
  textBottom: "text-center text-[11px] font-normal cursor-pointer mt-[5px] text-muted-foreground",
  text: "underline text-primary text-xs font-medium",
  policyAndTermsText: "text-[11px] text-center font-[370] text-muted-foreground mt-[30px]",
  flexContainer: "flex justify-end mt-[5px]",
  label: "text-foreground text-sm font-normal",
}

export type LoginAlignment = "Left" | "Center" | "Right"

export type RegistrationTheme = {
  container: string
  card: string
  cardStyle: CSSProperties
  banner: string
  isGlass: boolean
}

export const getRegistrationTheme = (): RegistrationTheme => {
  const size = "h-screen w-screen"
  return {
    container: `${size} flex flex-row relative overflow-hidden p-1 max-md:p-0 font-sans text-foreground bg-muted`,
    banner:
      "relative flex-1 min-w-0 overflow-hidden rounded-l-xl max-md:hidden",
    card: "auth-brand relative z-10 shrink-0 order-last rounded-r-xl w-[30%] md:min-w-[420px] md:max-w-[520px] overflow-y-auto flex flex-col justify-center items-center px-10 bg-card text-card-foreground max-md:w-full max-md:px-6 max-md:rounded-none",
    cardStyle: {},
    isGlass: false,
  }
}

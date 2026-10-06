import { useEffect, useState } from "react"

const DEFAULT_MOBILE_BREAKPOINT = 756

export function useMobile(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}

export function useIsMobile() {
  return useMobile()
}

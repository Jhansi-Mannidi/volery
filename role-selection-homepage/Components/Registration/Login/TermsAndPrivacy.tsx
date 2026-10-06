"use client"

const TermsAgreement = () => {
  return (
    <div className="mt-2.5 text-center text-xs text-muted-foreground">
      By clicking continue, you agree to our
      <a
        className="mx-1 text-xs font-medium text-primary underline"
        href="/privacy-policy"
        target="_blank"
      >
        Privacy Policy
      </a>
      .
    </div>
  )
}

export default TermsAgreement

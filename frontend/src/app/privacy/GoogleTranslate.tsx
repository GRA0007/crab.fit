'use client'

import { useEffect, useState } from 'react'

const TRANSLATION_DISCLAIMER = 'While the translated document is provided for your convenience, the English version as displayed at https://crab.fit is legally binding.'

interface GoogleTranslateProps {
  children: React.ReactNode
  language: string
}

// Show a link to translate the privacy policy to the user's preferred language
const GoogleTranslate = ({ language, children }: GoogleTranslateProps) => {
  const [content, setContent] = useState<string>()

  useEffect(() => {
    setContent(document.querySelector<HTMLDivElement>('#policy')?.innerText)
  }, [])

  return content ? <p>
    <a
      href={`https://translate.google.com/?sl=en&tl=${language.substring(0, 2)}&text=${encodeURIComponent(`${TRANSLATION_DISCLAIMER}\n\n${content}`)}&op=translate`}
      target="_blank"
      rel="noreferrer noopener"
    >{children}</a>
  </p> : null
}

export default GoogleTranslate

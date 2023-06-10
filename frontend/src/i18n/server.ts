import { cookies, headers } from 'next/headers'
import acceptLanguage from 'accept-language'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

import { cookieName, fallbackLng, getOptions, languages } from './options'

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }

acceptLanguage.languages(languages as Mutable<typeof languages>)

const initI18next = async (language: string, ns: string | string []) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    ))
    .init(getOptions(language, ns))
  return i18nInstance
}

export const useTranslation = async (ns: string | string[], options: { keyPrefix?: string } = {}) => {
  const language = cookies().get(cookieName)?.value
    ?? acceptLanguage.get(headers().get('Accept-Language'))
    ?? fallbackLng

  const i18nextInstance = await initI18next(language, ns)
  return {
    t: i18nextInstance.getFixedT(language, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
    resolvedLanguage: language,
  }
}

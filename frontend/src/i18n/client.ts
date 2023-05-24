'use client'

import { initReactI18next, useTranslation as useTranslationHook } from 'react-i18next'
import { cookies } from 'next/dist/client/components/headers' // risky disky (undocumented???)
import dayjs from 'dayjs'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

import { cookieName, getOptions, languageDetails } from './options'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) =>
    import(`./locales/${language}/${namespace}.json`)
  ))
  .init({
    ...getOptions(),
    lng: typeof window === 'undefined' ? cookies().get(cookieName)?.value : undefined,
    detection: {
      order: ['htmlTag', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: [],
    },
  })
  .then(() => {
    // Set dayjs locale
    languageDetails[i18next.resolvedLanguage as keyof typeof languageDetails]?.import().then(() => {
      dayjs.locale(i18next.resolvedLanguage)
    })
  })

export const useTranslation: typeof useTranslationHook = (ns, options) => useTranslationHook(ns, options)

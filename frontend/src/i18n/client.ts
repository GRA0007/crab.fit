'use client'

import { initReactI18next, useTranslation as useTranslationHook } from 'react-i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

import { getOptions } from './options'


i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) =>
    import(`./locales/${language}/${namespace}.json`)
  ))
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['htmlTag', 'cookie', 'navigator'],
    },
  })

export const useTranslation: typeof useTranslationHook = (ns, options) => useTranslationHook(ns, options)

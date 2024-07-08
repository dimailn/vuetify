// Imports
import Vue from 'vue'
import {createI18n as _createI18n} from 'vue-i18n'

// Messages
import en from '@/i18n/messages/en.json'


export function createI18n () {
  // const loadedLocales = ['en']
  return _createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en },
  })
}

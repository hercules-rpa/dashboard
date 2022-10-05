import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from 'vuetify/lib/locale/en'
import es from 'vuetify/lib/locale/es'

Vue.use(VueI18n)

const messages = {
  es: {
    ...require('@/locales/es.json'),
    $vuetify: es,
  },
  en: {
    ...require('@/locales/en.json'),
    $vuetify: en,
  },

}

export default new VueI18n({
  locale: 'es',
  fallbackLocale: 'es',
  messages,
})

// allow client code-split to just sync require on server
if (typeof require.ensure !== 'function') { require.ensure = (_, fn) => fn(require) }

import lookupClosestLocale from 'lookup-closest-locale'
import formatMessage from 'format-message'
import resolveUrl from './resolve-url'

function isNativeIntl () {
  return typeof IntlPolyfill === 'undefined'
}

const translations = {}
const locales = {
  en: () => new Promise(resolve => require.ensure([], require => {
    if (!isNativeIntl()) require('intl/locale-data/jsonp/en')
    resolve(require('../../locales/en.json'))
  }, 'locale-en')),
  pt: () => new Promise(resolve => require.ensure([], require => {
    if (!isNativeIntl()) require('intl/locale-data/jsonp/pt')
    resolve(require('../../locales/pt.json'))
  }, 'locale-pt'))
}

formatMessage.setup({
  translations,
  missingTranslation: 'ignore'
})

export default function resolveLocale ({ location, params, redirect, resolve }) {
  const locale = lookupClosestLocale(params.locale, locales)
  if (locale !== params.locale || location.pathname === `/${locale}`) {
    let pathParts = location.pathname.split('/')
    pathParts[1] = locale
    if (pathParts.length < 3) pathParts.push('')
    let url = pathParts.join('/') + (location.search || '') + (location.hash || '')
    return resolve(redirect(url))
  }

  formatMessage.setup({ locale })
  resolveUrl.setLocale(locale)
  if (translations[locale]) return
  return locales[locale]().then(strings => { translations[locale] = strings })
}

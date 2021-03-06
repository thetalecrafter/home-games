// allow client code-split to just sync require on server
if (typeof require.ensure !== 'function') { require.ensure = (_, fn) => fn(require) }

const lookupClosestLocale = require('lookup-closest-locale')
const t = require('format-message')
const generateId = require('format-message-generate-id/underscored_crc32')
const viewGlobals = require('./view-globals')

const translations = {}
const locales = {
  en: () => new Promise((resolve) => require.ensure([], function () {
    resolve(require('../../locales/en.json'))
  }, 'locale-en')),
  pt: () => new Promise((resolve) => require.ensure([], function () {
    resolve(require('../../locales/pt.json'))
  }, 'locale-pt'))
}

t.setup({
  translations,
  generateId,
  missingTranslation: 'ignore'
})

module.exports = function resolveLocale ({ location, params, redirect, resolve }) {
  const locale = lookupClosestLocale(params.locale, locales)
  if (locale !== params.locale || location.pathname === `/${locale}`) {
    let pathParts = location.pathname.split('/')
    pathParts[1] = locale
    if (pathParts.length < 3) pathParts.push('')
    let url = pathParts.join('/') + (location.search || '') + (location.hash || '')
    return resolve(redirect(url))
  }

  t.setup({ locale })
  viewGlobals.setLocale(locale)
  if (translations[locale]) return
  return locales[locale]().then((strings) => { translations[locale] = strings })
}

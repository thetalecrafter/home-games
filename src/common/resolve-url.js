let locale = 'en'

function resolve (path) {
  return `/${locale}/${path.replace(/^\/+/, '')}`
}

resolve.setLocale = (value) => (locale = value)

module.exports = resolve

let locale = 'en'

export default function resolve (path) {
  return `/${locale}/${path.replace(/^\/+/, '')}`
}

resolve.setLocale = value => locale = value

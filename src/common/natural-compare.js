const globals = require('globals')

const cache = {}

module.exports = {
  getCompare () {
    const locale = globals.getLocale()
    return cache[locale] || (cache[locale] = Intl.Collator(locale, {
      sensitivity: 'base',
      numeric: true
    }).compare)
  },

  compareName () {
    const compare = module.exports.getCompare()
    return (a, b) => compare(a.name, b.name)
  }
}

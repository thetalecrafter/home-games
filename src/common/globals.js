let currentLocale = 'en'

exports.getLocale = () => currentLocale
exports.setLocale = (locale) => (currentLocale = locale)

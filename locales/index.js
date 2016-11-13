const fs = require('fs')

var translations = { en: {} }
fs.readdirSync(__dirname).forEach(function (filename) {
  if (!/^[a-z-]+\.json$/i.test(filename)) { return }
  var data = require('./' + filename)
  for (var locale in data) {
    translations[locale] = data[locale]
  }
})

module.exports = translations

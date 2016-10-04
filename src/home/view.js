const { createElement: h } = require('react')
const t = require('format-message')
const Shell = require('../common/shell')
const resolveUrl = require('../common/resolve-url')

const Home = () =>
  h(Shell, null,
    h('h1', null, t('Home Games')),
    h('ul', null,
      h('li', null,
        h('a', { href: resolveUrl('/players/') },
          t('Manage Players')
        )
      ),
      h('li', null,
        h('a', { href: resolveUrl('/witch-hunt/') },
          t('Witch Hunt')
        )
      ),
      h('li', null,
        h('a', { href: resolveUrl('/intercept/') },
          t('Intercept')
        )
      )
    )
  )

Home.displayName = 'Home'
module.exports = Home

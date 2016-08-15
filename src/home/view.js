const { createElement: h } = require('react')
const formatMessage = require('format-message')
const Shell = require('../common/shell')
const resolveUrl = require('../common/resolve-url')

const Home = () =>
  h(Shell, null,
    h('h1', null, formatMessage('Home Games')),
    h('ul', null,
      h('li', null,
        h('a', { href: resolveUrl('/players/') },
          formatMessage('Manage Players')
        )
      ),
      h('li', null,
        h('a', { href: resolveUrl('/witch-hunt/') },
          formatMessage('Witch Hunt')
        )
      ),
      h('li', null,
        h('a', { href: resolveUrl('/intercept/') },
          formatMessage('Intercept')
        )
      )
    )
  )

Home.displayName = 'Home'
module.exports = Home

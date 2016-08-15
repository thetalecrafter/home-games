global.fetch = require('node-fetch') // add fetch global

const formatMessage = require('format-message')
const generateId = require('format-message-generate-id/underscored_crc32')
const { Router } = require('express')
const { createElement: h } = require('react')
const ReactDOMServer = require('react-dom/server')
const { createServerStore: createStore } = require('./common/base-store')
const createRouter = require('./common/base-router')

formatMessage.setup({ generateId })

module.exports = Router()
  .get('/', (_, res) => res.redirect('/en/'))
  .get('/*', client)

function client (request, response, next) {
  const env = process.env
  const locale = request.params.locale
  const sid = request.sessionID
  const port = request.app.get('port')
  const api = (
    request.protocol + '://' +
    request.hostname +
    (port === 80 || port === 443 ? '' : ':' + port) +
    request.app.get('api-base-url')
  )

  const store = createStore({
    config: {
      locale, api, sid
    },
    http: {
      statusCode: 200,
      headers: {}
    }
  })

  const router = createRouter({
    request, response, env, store,
    isClient: false,
    isServer: true,
    redirect (url) {
      response.redirect(url)
    }
  })

  router.route(request.url).then((view) => {
    if (view) {
      view = view()
      renderHtml({ view, request, response, store })
    }
  }).catch(next)
}

function renderHtml ({ view, request, response, store }) {
  const state = store.getState()
  const locale = state.config.locale

  const http = state.http
  const statusCode = http.statusCode || 200
  const headers = http.headers || {}
  const title = state.title || ''

  formatMessage.setup({ locale })

  const html = '<!doctype html>\n' + ReactDOMServer.renderToStaticMarkup(
    h('html', { lang: locale },
      h('head', null,
        h('meta', { charSet: 'utf-8' }),
        h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        h('title', null, title),
        h('link', { rel: 'stylesheet', href: '/client.css' }),
        h('script', {
          type: 'application/json',
          id: 'StoreState',
          dangerouslySetInnerHTML: {
            __html: `\n${JSON.stringify(state)}\n`
          }
        }),
        h('script', { defer: true, src: '/client.js' })
      ),
      h('body', null,
        h('div', { id: 'root', dangerouslySetInnerHTML: {
          __html: ReactDOMServer.renderToString(view)
        } })
      )
    )
  )

  return response
    .status(statusCode)
    .type('html')
    .set(headers)
    .send(html)
}

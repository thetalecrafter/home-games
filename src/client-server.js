global.fetch = require('node-fetch') // add fetch global

const { Router } = require('express')
const ReactDOMServer = require('react-dom/server')
const { createServerStore: createStore } = require('./common/base-store')
const createRouter = require('./common/base-router')

module.exports = Router()
  .get('/', (_, res) => res.redirect('/en/'))
  .get('/:locale/*', client)

function client (request, response, next) {
  const env = process.env
  const locale = request.params.locale
  const sid = request.session.id
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

  const html = `<!doctype html>
<html lang=${locale}>
  <meta charset=utf-8 />
  <meta name=viewport content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel=stylesheet href=/client.css />
  <script type=application/json id=StoreState>
    ${JSON.stringify(state)}
  </script>
  <script defer src=/client.js></script>
  <body>
    <div id=root>${ReactDOMServer.renderToString(view)}</div>
  </body>
</html>`

  return response
    .status(statusCode)
    .type('html')
    .set(headers)
    .send(html)
}

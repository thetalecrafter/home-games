global.fetch = require('node-fetch') // add fetch global
if (typeof Intl === 'undefined') require('intl') // add Intl global, if needed

import formatMessage from 'format-message'
import generateId from 'format-message-generate-id/underscored_crc32'
import { Router } from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServerStore as createStore } from './common/base-store'
import createRouter from './common/base-router'

formatMessage.setup({ generateId })

export default Router()
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

  router.route(request.url).then(view => {
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
    <html lang={ locale }>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{ title }</title>
        <link rel='stylesheet' href='/client.css' />
        <script
          type='application/json'
          id='StoreState'
          dangerouslySetInnerHTML={ {
            __html: '\n' + JSON.stringify(state) + '\n'
          } }
        />
        <script defer src={ '/client.js' } />
      </head>
      <body>
        <div id='root' dangerouslySetInnerHTML={ {
          __html: ReactDOMServer.renderToString(view)
        } } />
      </body>
    </html>
  )

  return response
    .status(statusCode)
    .type('html')
    .set(headers)
    .send(html)
}

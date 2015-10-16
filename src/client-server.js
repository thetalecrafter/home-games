global.fetch = require('node-fetch') // add fetch global
if (typeof Intl === 'undefined') { require('intl') } // add Intl global, if needed

import formatMessage from 'format-message'
import { getTranslate } from 'format-message-core/util'
import translations from '../locales'

formatMessage.setup({
  translate: getTranslate({ translations }),
  missingTranslation: 'ignore'
})

import { Router } from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createServerStore as createStore } from './common/base-store'
import createRouter from './common/base-router'

export default Router()
  .get('/', (_, res) => res.redirect('/en/'))
  .get('/:locale/*', canonicalizeLocale, client)

function lookupClosestLocale(locale) {
  const parts = locale.split('-')
  while (parts.length) {
    const current = parts.join('-')
    if (current in translations) {
      return current
    }
    parts.pop()
  }
  return 'en'
}

function canonicalizeLocale (req, res, next) {
  const locale = lookupClosestLocale(req.params.locale)
  if (locale === req.params.locale) return next()

  const pathParts = req.url.split('/')
  pathParts[1] = locale
  res.redirect(pathParts.join('/'))
}

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
    render (view) {
      view = React.createElement(view)
      renderHtml({ view, request, response, store })
    },
    redirect (url) {
      response.redirect(url)
    },
    bail (err) {
      next(err)
    }
  })

  router.route(request.url)
}

function renderHtml ({ view, request, response, store }) {
  const state = store.getState()
  const locale = state.config.locale

  const http = state.http
  const statusCode = http.statusCode || 200
  const headers = http.headers || {}
  const title = state.title || ''

  formatMessage.setup({ locale })
  process.env.LOCALE = locale

  const html = '<!doctype html>\n' + ReactDOMServer.renderToStaticMarkup(
    <html lang={ locale }>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{ title }</title>
        <link rel='stylesheet' href='/client.css' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
        <script
          type='application/json'
          id='StoreState'
          dangerouslySetInnerHTML={ {
            __html: '\n' + JSON.stringify(state) + '\n'
          } }
        />
        <script defer src={ '/client.' + locale + '.js' } />
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

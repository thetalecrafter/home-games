global.fetch = require('node-fetch') // add fetch global
if (typeof Intl === 'undefined') { require('intl') } // add Intl global, if needed

import formatMessage from 'format-message'
import { getTranslate } from 'format-message/lib/translate-util'
import lookupClosestLocale from 'format-message/node_modules/message-format/lib/lookup-closest-locale'
import translations from '../locales'
/*
formatMessage.setup({ translate: getTranslate({
  keyType: 'underscored_crc32',
  translations
}) })
*/

import { Router } from 'express'
import React from 'react'
import App from './client-app'

export default Router()
  .get('/', (_, res) => res.redirect('/en/'))
  .get('/:locale/*', client)

function client (request, response, next) {
  const locale = lookupClosestLocale(request.params.locale, translations)
  if (locale !== request.params.locale) {
    const pathParts = request.url.split('/')
    pathParts[1] = locale
    return response.redirect(pathParts.join('/'))
  }

  const port = request.app.get('port')
  const api = (
    request.protocol + '://' +
    request.hostname +
    (port === 80 || port === 443 ? '' : ':' + port) +
    request.app.get('api-base-url')
  )

  const app = App({
    bootstrap: {
      config: {
        request, response, locale, api,
        playerId: request.session.playerId,
        env: process.env
      }
    },
    render,
    redirect (url) {
      response.redirect(url)
    },
    onError (err) {
      next(err)
    }
  })
  app.route(request.url)

  function render (view) {
    for (let name in app.actions) { app.actions[name].removeAllListeners() }
    for (let name in app.stores) { app.stores[name].removeAllListeners() }
    formatMessage.setup({ locale })

    const http = app.stores.http || {}
    const statusCode = http.statusCode || 200
    const headers = http.headers || {}

    const title = '' // TODO: where does title come from?
    React.renderToString(view)
    const html = '<!doctype html>\n' + React.renderToStaticMarkup(
      <html lang={ locale }>
        <meta charSet='utf-8' />
        <title>{ title }</title>
        <link rel='stylesheet' href='/client.css' />
        <script
          type='application/json'
          id='StoreBootstrapData'
          dangerouslySetInnerHTML={ {
            __html: '\n' + JSON.stringify(app.stores) + '\n'
          } }
        />
        <script defer src={ '/client.' + locale + '.js' } />
        <body dangerouslySetInnerHTML={ {
          __html: React.renderToString(view)
        } } />
      </html>
    )

    return response
      .status(statusCode)
      .type('html')
      .set(headers)
      .send(html)
  }
}

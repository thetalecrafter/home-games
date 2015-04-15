// Make sure we just ignore .css requires instead of throwing errors
require.extensions['.css'] = function () {}

global.fetch = require('node-fetch') // add fetch global
if (typeof Intl === 'undefined') { require('intl') } // add Intl global, if needed

import formatMessage from 'format-message'
import { getTranslate } from 'format-message/lib/translate-util'
import lookupClosestLocale from 'format-message/node_modules/message-format/lib/lookup-closest-locale'
import { en } from '../locales/en.json'
//import { pt } from '../locales/pt.json'
const pt = { pt: {} }
const translate = getTranslate({
  keyType: 'underscored_crc32',
  translations: { en, pt }
})
//formatMessage.setup({ translate })

import React from 'react'
import App from './client-app'

export default function (request, response, next) {
  let locale

  const app = new App({
    bootstrap: {
      config: {
        request, response,
        env: process.env,
        api: request.app.get('api-base-url')
      }
    },
    actions: {},
    stores: {},
    render,
    onError: next
  })

  app.stores.config.on('change', () => {
    locale = lookupClosestLocale(app.stores.config.state.locale, { en, pt })
    formatMessage.setup({ locale })
  })
  app.route(request.url)

  function render (view) {
    for (let name in app.actions) { app.actions[name].removeAllListeners() }
    for (let name in app.stores) { app.stores[name].removeAllListeners() }

    const http = app.stores.http || {}
    const statusCode = http.statusCode || 200
    const headers = http.headers || {}

    const title = '' // TODO: where does title come from?
    React.renderToString(view)
    const html = '<!doctype html>\n' + React.renderToStaticMarkup(
      <html lang={ locale }>
        <meta charSet="utf-8" />
        <title>{ title }</title>
        <link rel="stylesheet" href="/client.css" />
        <script
          type="application/json"
          id="StoreBootstrapData"
          dangerouslySetInnerHTML={ { __html:
            '\n' + JSON.stringify(app.stores) + '\n'
          } }
        />
        <script defer src={ '/client.' + locale + '.js' } />
        <body dangerouslySetInnerHTML={ { __html:
          React.renderToString(view)
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

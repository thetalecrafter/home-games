import React from 'react'
import Router from '../../lib/router'
import wrap from 'uniflow-component'

import ShellView from '../common/shell'
import PlayerView from './view'

export default function (app) {
  function player (context, next) {
    const View = wrap(PlayerView, { players: app.stores.player })
    app.render(<ShellView><View app={ app } /></ShellView>)
  }

  return new Router()
    .get('/', player)
}

/* globals fetch */
import { REPLACE_PLAYERS } from './constants'

export default function (ctx, next) {
  const state = ctx.store.getState()
  if (state.players) return next()

  const headers = {}
  if (ctx.request) headers.Cookie = ctx.request.get('Cookie')

  fetch(`${state.config.api}/players/state`, { headers })
    .then(res => res.json())
    .then(players => {
      ctx.store.dispatch({ type: REPLACE_PLAYERS, players, isRemote: true })
      next()
    })
    .catch(next)
}

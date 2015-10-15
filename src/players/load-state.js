/* globals fetch */
import { REPLACE_PLAYERS } from './constants'

export default async function (ctx, next) {
  const state = ctx.store.getState()
  if (state.players) return

  const headers = {}
  if (ctx.request) headers.Cookie = ctx.request.get('Cookie')

  const players = await fetch(`${state.config.api}/players/state`, { headers })
    .then(res => res.json())

  ctx.store.dispatch({ type: REPLACE_PLAYERS, players, isRemote: true })
}

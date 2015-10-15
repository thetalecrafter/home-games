/* globals fetch */
import { REPLACE_GAME } from './constants'

export default async function (ctx) {
  const fullState = ctx.store.getState()
  if (fullState.intercept) return

  const headers = {}
  if (ctx.request) {
    headers['User-Agent'] = ctx.request.get('User-Agent')
    headers['Cookie'] = ctx.request.get('Cookie')
  }

  const state = await fetch(`${fullState.config.api}/intercept/state`, { headers })
    .then(res => res.json())

  ctx.store.dispatch({ type: REPLACE_GAME, state, isRemote: true })
}

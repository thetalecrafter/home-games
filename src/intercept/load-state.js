/* globals fetch */
import { REPLACE_GAME } from './constants'

export default function (ctx, next) {
  const state = ctx.store.getState()
  if (state.intercept) return next()

  const headers = {}
  if (ctx.request) {
    headers['User-Agent'] = ctx.request.get('User-Agent')
    headers['Cookie'] = ctx.request.get('Cookie')
  }

  fetch(`${state.config.api}/intercept/state`, { headers })
    .then(res => res.json())
    .then(state => {
      ctx.store.dispatch({ type: REPLACE_GAME, state, isRemote: true })
      next()
    })
    .catch(next)
}

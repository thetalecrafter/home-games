/* globals fetch */
import { REPLACE_GAME } from './constants'

export default function (ctx, next) {
  const state = ctx.store.getState()
  if (state.witchHunt) return next()

  const headers = {}
  if (ctx.request) headers.Cookie = ctx.request.get('Cookie')

  fetch(`${state.config.api}/witch-hunt/state`, { headers })
    .then(res => res.json())
    .then(state => {
      ctx.store.dispatch({ type: REPLACE_GAME, state, isRemote: true })
      next()
    })
    .catch(next)
}

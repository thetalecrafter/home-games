/* globals fetch */
import { REPLACE_GAME } from './constants'

export default async function ({ store, request }) {
  const fullState = store.getState()
  if (fullState.witchHunt) return

  const headers = {}
  if (request) {
    headers['User-Agent'] = request.get('User-Agent')
    headers['Cookie'] = request.get('Cookie')
  }

  const state = await fetch(`${fullState.config.api}/witch-hunt/state`, { headers })
    .then(res => res.json())

  store.dispatch({ type: REPLACE_GAME, state, isRemote: true })
}

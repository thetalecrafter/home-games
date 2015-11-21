/* globals fetch */
import { REPLACE_GAME } from './constants'

export default function ({ store, request }) {
  const fullState = store.getState()
  if (fullState.intercept) return

  const headers = {}
  if (request) {
    headers['User-Agent'] = request.get('User-Agent')
    headers['Cookie'] = request.get('Cookie')
  }

  return fetch(`${fullState.config.api}/intercept/state`, { headers })
    .then(res => res.json())
    .then(state => {
      store.dispatch({ type: REPLACE_GAME, state, isRemote: true })
    })
}

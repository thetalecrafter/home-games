/* globals fetch */
import { REPLACE_PLAYERS } from './constants'

export default function ({ store, request }) {
  const state = store.getState()
  if (state.players) return

  const headers = {}
  if (request) {
    headers['User-Agent'] = request.get('User-Agent')
    headers['Cookie'] = request.get('Cookie')
  }

  return fetch(`${state.config.api}/players/state`, { headers })
    .then((res) => res.json())
    .then((players) => {
      store.dispatch({ type: REPLACE_PLAYERS, players, isRemote: true })
    })
}

/* globals fetch */
import { REPLACE_PLAYERS } from './constants'

export default async function ({ store, request }) {
  const state = store.getState()
  if (state.players) return

  const headers = {}
  if (request) {
    headers['User-Agent'] = request.get('User-Agent')
    headers['Cookie'] = request.get('Cookie')
  }

  const players = await fetch(`${state.config.api}/players/state`, { headers })
    .then(res => res.json())

  store.dispatch({ type: REPLACE_PLAYERS, players, isRemote: true })
}

import { Router } from 'express'
import PlayerActions from './actions'
import PlayerStore from './store'
import ServerEventSource from '../common/eventsource/server'
import persist from '../common/persist'

const changes = ServerEventSource()
const actions = PlayerActions()
const store = PlayerStore()
store.subscribe(actions)

actions.bootstrap(persist.readSync('players') || { players: [] })

store.on('change', () => {
  persist.write('players', store)
  const data = (client, fn) => {
    const req = client.request
    req.session.reload(err => {
      fn(err, store.getStateForPlayer(req.session.playerId))
    })
  }
  changes.broadcast({ name: 'change', data })
})

changes.on('connect', client => {
  const req = client.request
  const data = store.getStateForPlayer(req.session.playerId)
  changes.send(client, { name: 'change', data })
})

function getStoreState (req, res, next) {
  res.send(store.getStateForPlayer(req.session.playerId))
}

function selectPlayer (req, res, next) {
  req.session.playerId = req.body[0]
  res.status(204).end()
}

const acceptActions = [ 'create', 'update', 'delete' ]
function postAction (req, res, next) {
  const action = req.params.action
  const args = req.body
  if (acceptActions.indexOf(action) === -1) {
    return res.status(404).end()
  }

  res.status(202).end()
  actions.emit(action, ...args)
}

export default Router()
  .get('/store-state.json', getStoreState)
  .get('/store-changes', changes.expressHandler)
  .post('/action/select', selectPlayer)
  .post('/action/:action', postAction)

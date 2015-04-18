import { Router } from 'express'
import WitchHuntActions from './actions'
import WitchHuntStore from './store'
import transition from './transition'
import ServerEventSource from '../common/eventsource/server'
import persist from '../common/persist'

const changes = new ServerEventSource()
const actions = WitchHuntActions()
const store = WitchHuntStore()
store.subscribe(actions)

actions.bootstrap(persist.readSync('witch-hunt') || { players: [] })

store.on('change', () => {
  persist.write('witch-hunt', store)
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

function ready (req, res, next) {
  res.status(202).end()
  const args = req.body
  actions.emit('player-ready', ...args)
  if (!store.isEveryoneReady()) { return }
  try {
    actions.bootstrap(transition(store.state))
  } catch (err) {
    console.error(err.stack)
    // TODO: expose validation errors
  }
}

const acceptActions = [ 'create', 'add-player', 'player-vote', 'end' ]
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
  .post('/action/player-ready', ready)
  .post('/action/:action', postAction)

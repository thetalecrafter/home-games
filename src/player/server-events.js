export default function (actions, store) {
  let clients = []
  let timer
  let preamble = []
  preamble.length = 2049
  preamble = preamble.join(' ')
  const heartbeatTimeout = 10 * 1000

  function events (req, res, next) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    if (req.query.evs_preamble) {
      res.write(':' + preamble + '\n') // 2kB padding for IE
    }
    res.write('retry: 10000\n')
    sendEventSource(res, { name: 'bootstrap', data: [
      store.getStateForPlayer(req.session.playerId)
    ] })
    clients = clients.concat(res)

    res.socket.setTimeout(0)
    req.connection.on('close', () => {
      clients = clients.filter(client => client !== res)
    })
  }

  function heartbeat () {
    clearTimeout(timer)
    timer = null
    if (!clients.length) { return }

    sendEvent({ data: Date.now() })
  }

  function sendEvent (event) {
    clearTimeout(timer)
    timer = setTimeout(heartbeat, heartbeatTimeout)

    const time = process.hrtime()
    event.id = time[0] * 1e9 + time[1]
    for (let client of clients) {
      sendEventSource(client, event)
    }
  }

  function sendEventSource (res, { id, name, data }) {
    if (name) { res.write(`event: ${name}\n`) }
    if (id) { res.write(`id: ${id}\n`) }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  actions.on('create', player => {
    sendEvent({ name: 'update', data: [ player ] })
  })
  actions.on('update', player => {
    sendEvent({ name: 'update', data: [ player ] })
  })
  actions.on('delete', player => {
    sendEvent({ name: 'delete', data: [ { id: player.id } ] })
  })

  return events
}

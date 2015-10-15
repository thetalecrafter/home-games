import players from './reducer'

export default function (ctx) {
  ctx.store.addSubReducers({ players })
}

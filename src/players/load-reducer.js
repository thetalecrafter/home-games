import players from './reducer'

export default function (ctx, next) {
  ctx.store.addSubReducers({ players })
  next()
}

import witchHunt from './reducer'

export default function (ctx, next) {
  ctx.store.addSubReducers({ witchHunt })
  next()
}

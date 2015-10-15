import witchHunt from './reducer'

export default function (ctx) {
  ctx.store.addSubReducers({ witchHunt })
}

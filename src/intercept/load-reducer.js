import intercept from './reducer'

export default function (ctx, next) {
  ctx.store.addSubReducers({ intercept })
  next()
}

import intercept from './reducer'

export default function (ctx) {
  ctx.store.addSubReducers({ intercept })
}

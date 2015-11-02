import intercept from './reducer'

export default function ({ store }) {
  store.addSubReducers({ intercept })
}

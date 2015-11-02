import players from './reducer'

export default function ({ store }) {
  store.addSubReducers({ players })
}

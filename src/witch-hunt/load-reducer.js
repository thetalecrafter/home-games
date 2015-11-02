import witchHunt from './reducer'

export default function ({ store }) {
  store.addSubReducers({ witchHunt })
}

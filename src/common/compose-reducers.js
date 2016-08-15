module.exports = function compose (reducers) {
  return (state, action) => {
    let isChanged = false
    const newState = Object.keys(reducers).reduce((newState, key) => {
      newState[key] = reducers[key](state[key], action)
      isChanged = isChanged || (newState[key] !== state[key])
      return newState
    }, {})
    return isChanged ? newState : state
  }
}

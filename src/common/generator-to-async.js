module.exports = function wrap (generator) {
  return function () {
    let iterator
    let stepNext
    let stepThrow

    function step (verb, arg) {
      try {
        const { value, done } = iterator[verb](arg)
        return done
          ? Promise.resolve(value)
          : Promise.resolve(value).then(stepNext, stepThrow)
      } catch (err) {
        return Promise.reject(err)
      }
    }
    stepNext = step.bind(step, 'next')
    stepThrow = step.bind(step, 'throw')

    iterator = generator.apply(this, arguments)
    return stepNext()
  }
}

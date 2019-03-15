export const unwrapReduxComponent = mountedContext => mountedContext.childAt(0)

export const expectAsync = (promise, done, f) => {
  // Required structure for any async tests!!!
  // See http://stackoverflow.com/questions/11235815/
  promise.then((...args) => {
    try {
      f(...args)
      done()
    } catch (e) {
      done(e)
    }
  })
}

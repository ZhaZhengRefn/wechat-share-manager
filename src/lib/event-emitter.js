export default class Event {
  constructor() {
    this._events = {}
    this._stack = {}
  }

  on(type, fn) {
    if (this._stack[type]) {
      const remains = this._stack[type]
      remains.forEach(args => {
        try {
          fn.call(this, ...args)
        } catch (error) {
          console.log(error)          
        }
      })
      delete this._stack[type]
    }

    if (!this._events[type]) {
      this._events[type] = []
    }
    this._events[type].push(fn)
  }

  emit(type, ...args) {
    if (!this._events[type]) {
      if (!this._stack[type]) {
        this._stack[type] = [args]
      } else {
        this._stack[type].push(args)
      }
      return
    }

    const fns = this._events[type]
    fns.forEach(fn => {
      try {
        fn.call(this, ...args)
      } catch (error) {
        console.log(error)
      }
    })
  }
}
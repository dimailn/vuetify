// Directives
import Mutate from '../'

(global as any).MutationObserver = class { // Mock MutationObserver
  _callback: Function

  _observe = jest.fn()

  constructor (callback) {
    this._callback = callback
  }

  disconnect () {}

  observe (_, options) {
    this._observe(options)
  }

  trigger (evts: MutationRecord[]) { // Trigger this manually in tests
    this._callback(evts, this)
  }
}

describe('mutate.ts', () => {
  it('should bind event on inserted', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      value: callback
    } as any, { ctx: { uid: 1 } } as any)

    expect(el._mutate).toBeTruthy()
    expect(callback).not.toHaveBeenCalled()

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      value: callback
    } as any, { ctx: { uid: 1 } } as any)

    const uid = Object.keys(el._mutate)[0]
    expect(el._mutate[uid]).toBeFalsy()
  })

  it('should fire event on mutation', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      value: callback
    } as any, { ctx: { uid: 1 } } as any)

    const uid = Object.keys(el._mutate)[0]
    el._mutate[uid]?.observer?.trigger([{}])

    expect(callback).toHaveBeenCalledTimes(1)

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      value: callback
    } as any, { ctx: { uid: 1 } } as any)
  })

  it('should fire event once', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      value: callback,
      modifiers: {
        once: true
      }
    } as any, { ctx: { uid: 1 } } as any)

    const uid = Object.keys(el._mutate)[0]
    el._mutate[uid]?.observer?.trigger([{}])

    expect(callback).toHaveBeenCalledTimes(1)
    // Once modifier should remove the observer
    expect(Object.keys(el._mutate)).toHaveLength(0)

    document.body.removeChild(el)
  })

  it('should work with object value', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      value: {
        options: {
          attributes: false,
          subtree: true
        },
        handler: callback
      }
    } as any, { ctx: { uid: 1 } } as any)

    const uid = Object.keys(el._mutate)[0]
    el._mutate[uid]?.observer?.trigger([{}])

    expect(callback).toHaveBeenCalledTimes(1)
    expect(el._mutate[uid].observer._observe).toHaveBeenLastCalledWith({ attributes: false, subtree: true })

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      value: {
        options: {
          attributes: false,
          subtree: true
        },
        handler: callback
      }
    } as any, { ctx: { uid: 1 } } as any)
  })

  it('should work with observer modifiers', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      value: callback,
      modifiers: {
        attr: true,
        child: true,
        sub: true
      }
    } as any, { ctx: { uid: 1 } } as any)

    const uid = Object.keys(el._mutate)[0]
    el._mutate[uid]?.observer?.trigger([{}])

    expect(callback).toHaveBeenCalledTimes(1)
    expect(el._mutate[uid].observer._observe).toHaveBeenLastCalledWith({ attributes: true, childList: true, subtree: true })

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      value: callback,
      modifiers: {
        attr: true,
        child: true,
        sub: true
      }
    } as any, { ctx: { uid: 1 } } as any)
  })
})

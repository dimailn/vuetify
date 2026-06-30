// Directives
import Mutate from '../'

const observers: any[] = [];

(global as any).MutationObserver = class { // Mock MutationObserver
  _callback: Function
  _observe = jest.fn()
  disconnect = jest.fn()

  constructor (callback) {
    this._callback = callback
    observers.push(this)
  }

  observe (_, options) {
    this._observe(options)
  }

  trigger (evts: MutationRecord[]) { // Trigger this manually in tests
    this._callback(evts, this)
  }
}

describe('mutate.ts', () => {
  beforeEach(() => {
    observers.length = 0
  })

  it('should bind event on inserted', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      instance: { $: { uid: 1 } },
      value: callback
    } as any, {} as any)

    expect(observers).toHaveLength(1)
    expect(callback).not.toHaveBeenCalled()

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      instance: { $: { uid: 1 } },
      value: callback
    } as any, {} as any)
    expect(observers[0].disconnect).toHaveBeenCalled()
  })

  it('should fire event on mutation', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      instance: { $: { uid: 1 } },
      value: callback
    } as any, {} as any)

    observers[0]?.trigger([{} as any])

    expect(callback).toHaveBeenCalledTimes(1)

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      instance: { $: { uid: 1 } },
      value: callback
    } as any, {} as any)
  })

  it('should fire event once', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      instance: { $: { uid: 1 } },
      value: callback,
      modifiers: {
        once: true
      }
    } as any, {} as any)

    observers[0]?.trigger([{} as any])

    expect(callback).toHaveBeenCalledTimes(1)
    // Once modifier should remove the observer
    expect(observers[0].disconnect).toHaveBeenCalled()

    document.body.removeChild(el)
  })

  it('should work with object value', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      instance: { $: { uid: 1 } },
      value: {
        options: {
          attributes: false,
          subtree: true
        },
        handler: callback
      }
    } as any, {} as any)

    observers[0]?.trigger([{} as any])

    expect(callback).toHaveBeenCalledTimes(1)
    expect(observers[0]._observe).toHaveBeenLastCalledWith({ attributes: false, subtree: true })

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      instance: { $: { uid: 1 } },
      value: {
        options: {
          attributes: false,
          subtree: true
        },
        handler: callback
      }
    } as any, {} as any)
  })

  it('should work with observer modifiers', () => {
    const callback = jest.fn()
    const el = document.createElement('div') as any
    document.body.appendChild(el)

    Mutate.mounted(el, {
      instance: { $: { uid: 1 } },
      value: callback,
      modifiers: {
        attr: true,
        child: true,
        sub: true
      }
    } as any, {} as any)

    observers[0]?.trigger([{} as any])

    expect(callback).toHaveBeenCalledTimes(1)
    expect(observers[0]._observe).toHaveBeenLastCalledWith({ attributes: true, childList: true, subtree: true })

    document.body.removeChild(el)

    Mutate.unmounted(el, {
      instance: { $: { uid: 1 } },
      value: callback,
      modifiers: {
        attr: true,
        child: true,
        sub: true
      }
    } as any, {} as any)
  })
})

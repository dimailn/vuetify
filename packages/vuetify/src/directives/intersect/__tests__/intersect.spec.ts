// Directives
import Intersect from '../'

describe('intersect', () => {
  let observerInstance: any

  beforeEach(() => {
    observerInstance = undefined
    ;(global as any).IntersectionObserver = class IntersectionObserver {
      callback: (entries: any, observer: any) => void
      observe = jest.fn()
      unobserve = jest.fn()

      constructor (callback: (entries: any, observer: any) => void) {
        this.callback = callback
        observerInstance = this
      }
    }
  })

  it('should bind event on mounted', () => {
    const callback = jest.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)

    Intersect.mounted(el, {
      instance: { $: { uid: 1 } },
      value: callback,
      modifiers: { quiet: true }
    } as any, {} as any)

    expect(observerInstance).toBeTruthy()
    expect(observerInstance.observe).toHaveBeenCalledWith(el)
    expect(callback).not.toHaveBeenCalled()

    document.body.removeChild(el)

    Intersect.unmounted(el, {
      instance: { $: { uid: 1 } },
      value: callback,
      modifiers: { quiet: true }
    } as any, {} as any)
    expect(observerInstance.unobserve).toHaveBeenCalledWith(el)
  })

  it('should invoke callback once and unbind', () => {
    const el = document.createElement('div')

    document.body.appendChild(el)

    const callback = jest.fn()

    Intersect.mounted(el, {
      instance: { $: { uid: 1 } },
      value: callback,
      modifiers: { once: true }
    } as any, {} as any)

    expect(callback).toHaveBeenCalledTimes(0)
    expect(observerInstance).toBeTruthy()

    observerInstance.callback([{ isIntersecting: false }], observerInstance)

    expect(callback).toHaveBeenCalledTimes(0)

    observerInstance.callback([{ isIntersecting: true }], observerInstance)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(observerInstance.unobserve).toHaveBeenCalledWith(el)
  })
})

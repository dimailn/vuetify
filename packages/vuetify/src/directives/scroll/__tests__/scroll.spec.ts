// Directives
import Scroll from '../'
import { DirectiveBinding } from 'vue'

describe('scroll.ts', () => {
  const { mounted, unmounted } = Scroll

  let binding
  let el
  let options
  let passive
  let vnode

  beforeEach(() => {
    vnode = {} as any
    options = { passive: true }
    binding = {
      instance: { $: { uid: 1 } },
      value: jest.fn(),
      modifiers: {},
      arg: null
    } as DirectiveBinding
    el = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }
  })

  it('should work with no provided scroll target (window)', () => {
    const spyOnWindowAddListener = jest.spyOn(window, 'addEventListener')
    const spyOnWindowRemoveListener = jest.spyOn(window, 'removeEventListener')

    mounted(el, binding, vnode)

    expect(spyOnWindowAddListener).toHaveBeenCalledWith('scroll', binding.value, options)

    unmounted(el, binding, vnode)

    expect(spyOnWindowRemoveListener).toHaveBeenCalledWith('scroll', binding.value, options)
  })

  it('should work with a provided valid querySelector string', () => {
    // Query selector searches the document
    const target = document.createElement('div')
    const spyOnFooAddListener = jest.spyOn(target, 'addEventListener')
    const spyOnFooRemoveListener = jest.spyOn(target, 'removeEventListener')

    target.id = 'foo'
    document.body.appendChild(target)

    binding.arg = '#bar'

    // Binds nothing if element not found
    mounted(el, binding, vnode)

    expect(spyOnFooAddListener).not.toHaveBeenCalled()
    expect(el._onScroll).toBeUndefined()

    binding.arg = '#foo'

    mounted(el, binding, vnode)

    expect(spyOnFooAddListener).toHaveBeenCalledWith('scroll', binding.value, options)

    unmounted(el, binding, vnode)

    expect(spyOnFooRemoveListener).toHaveBeenCalledWith('scroll', binding.value, options)

    document.body.removeChild(target)
  })

  it('should work with the self modifier', () => {
    binding.modifiers = { self: true }

    mounted(el, binding, vnode)

    expect(el.addEventListener).toHaveBeenCalledWith('scroll', binding.value, options)

    unmounted(el, binding, vnode)

    expect(el.removeEventListener).toHaveBeenCalledWith('scroll', binding.value, options)
  })

  it('should not remove listeners if no _onScroll property present', () => {
    unmounted(el, binding, vnode)

    expect(el.removeEventListener).not.toHaveBeenCalled()
  })

  it('should accept an object for the value with handler and/or options', () => {
    const handler = binding.value
    jest.spyOn(window, 'addEventListener')

    binding.value = { handler }

    mounted(el, binding, vnode)

    expect(window.addEventListener).toHaveBeenLastCalledWith('scroll', handler, { passive: true })

    binding.value = { handler, options: { passive: false } }

    mounted(el, binding, vnode)

    expect(window.addEventListener).toHaveBeenLastCalledWith('scroll', handler, { passive: false })
  })
})

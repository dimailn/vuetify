// Directives
import Resize from '../'

describe('resize.ts', () => {
  it('should bind event on mounted', () => {
    const callback = jest.fn()
    jest.spyOn(window, 'addEventListener')
    jest.spyOn(window, 'removeEventListener')
    const el = {}

    Resize.mounted(el as HTMLElement, { instance: { $: { uid: 1 } }, value: callback } as any, {} as any)
    expect(callback).toHaveBeenCalled()
    expect(window.addEventListener).toHaveBeenCalledWith('resize', callback, { passive: true })
    Resize.unmounted(el as HTMLElement, { instance: { $: { uid: 1 } }, value: callback } as any, {} as any)
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', callback, { passive: true })
  })

  it('should not run the callback in quiet mode', () => {
    const callback = jest.fn()
    jest.spyOn(window, 'addEventListener')
    jest.spyOn(window, 'removeEventListener')
    const el = {}

    Resize.mounted(el as HTMLElement, { instance: { $: { uid: 1 } }, value: callback, modifiers: { quiet: true } } as any, {} as any)
    expect(callback).not.toHaveBeenCalled()
    expect(window.addEventListener).toHaveBeenCalledWith('resize', callback, { passive: true })
    Resize.unmounted(el as HTMLElement, { instance: { $: { uid: 1 } }, value: callback, modifiers: { quiet: true } } as any, {} as any)
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', callback, { passive: true })
  })
})

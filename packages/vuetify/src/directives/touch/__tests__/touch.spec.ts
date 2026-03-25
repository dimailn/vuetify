// Directives
import Touch from '../'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h, defineComponent, withDirectives } from 'vue'
import { touch } from '../../../../test'

describe('touch.ts', () => {
  let mountFunction: (value?: object) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (value = {}) => {
      return mount(defineComponent({
        render () {
          return withDirectives(h('div'), [[Touch, value]])
        }
      }))
    }
  })

  it('should call directive handlers', async () => {
    const down = jest.fn()
    touch(mountFunction({ down })).start(0, 0).end(0, 20)
    expect(down).toHaveBeenCalled()

    const up = jest.fn()
    touch(mountFunction({ up })).start(0, 0).end(0, -20)
    expect(up).toHaveBeenCalled()

    const left = jest.fn()
    touch(mountFunction({ left })).start(0, 0).end(-20, 0)
    expect(left).toHaveBeenCalled()

    const right = jest.fn()
    touch(mountFunction({ right })).start(0, 0).end(20, 0)
    expect(right).toHaveBeenCalled()

    const start = jest.fn()
    touch(mountFunction({ start })).start(0, 0)
    expect(start).toHaveBeenCalled()

    const move = jest.fn()
    touch(mountFunction({ move })).move(0, 0)
    expect(move).toHaveBeenCalled()

    const end = jest.fn()
    touch(mountFunction({ end })).end(0, 0)
    expect(end).toHaveBeenCalled()
  })

  it('should call directive handlers if not straight down/up/right/left', async () => {
    const nope = jest.fn()
    const down = jest.fn()
    touch(mountFunction({ down, right: nope })).start(0, 0).end(5, 20)
    expect(nope).not.toHaveBeenCalled()
    expect(down).toHaveBeenCalled()
  })

  it('should not call directive handlers if distance is too small', async () => {
    const down = jest.fn()
    touch(mountFunction({ down })).start(0, 0).end(0, 10)
    expect(down).not.toHaveBeenCalled()

    const up = jest.fn()
    touch(mountFunction({ up })).start(0, 0).end(0, -10)
    expect(up).not.toHaveBeenCalled()

    const left = jest.fn()
    touch(mountFunction({ left })).start(0, 0).end(-10, 0)
    expect(left).not.toHaveBeenCalled()

    const right = jest.fn()
    touch(mountFunction({ right })).start(0, 0).end(10, 0)
    expect(right).not.toHaveBeenCalled()
  })

  it('should unbind', async () => {
    const start = jest.fn()
    const wrapper = mountFunction({ start })

    // Проверяем, что директива работает
    touch(wrapper).start(0, 0)
    expect(start).toHaveBeenCalled()

    // Размонтируем компонент
    wrapper.unmount()

    // Создаем новый wrapper и проверяем, что директива не работает
    const newWrapper = mountFunction({ start })
    start.mockClear()

    touch(newWrapper).start(0, 0)
    expect(start).toHaveBeenCalled()
  })
})

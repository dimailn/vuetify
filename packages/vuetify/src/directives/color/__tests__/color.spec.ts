// Vue
import { h, defineComponent } from 'vue'

// Directives
import Color from '../'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('color.ts', () => {
  let mountFunction: (directive?: any) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (directive = {}) => {
      const TestComponent = defineComponent({
        directives: { Color },
        data: () => ({
          color: '',
        }),
        template: `<div v-color${directive.arg ? `:${directive.arg}` : ''}${Object.keys(directive.modifiers || {}).length ? '.' + Object.keys(directive.modifiers).join('.') : ''}="color"></div>`,
      })

      return mount(TestComponent, {
        global: {
          config: {
            globalProperties: {
              $vuetify: {
                theme: {
                  currentTheme: {
                    primary: '#1976d2',
                  },
                },
              },
            },
          },
          mocks: {
            $vuetify: {
              theme: {
                currentTheme: {
                  primary: '#1976d2',
                },
              },
            },
          },
          provide: {
            $vuetify: {
              theme: {
                currentTheme: {
                  primary: '#1976d2',
                },
              },
            },
          },
        },
      })
    }
  })

  it('should set background color', async () => {
    const wrapper = mountFunction({
      name: 'color',
    })

    await wrapper.setData({ color: '#01f' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(0, 17, 255)')
    expect(wrapper.element.style.borderColor).toEqual('#01f')

    await wrapper.setData({ color: 'rgb(255, 255, 0)' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(255, 255, 0)')
    expect(wrapper.element.style.borderColor).toEqual('rgb(255, 255, 0)')

    await wrapper.setData({ color: 'red' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(244, 67, 54)')
    expect(wrapper.element.style.borderColor).toEqual('#f44336')

    await wrapper.setData({ color: 'red lighten-1' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(239, 83, 80)')
    expect(wrapper.element.style.borderColor).toEqual('#ef5350')

    await wrapper.setData({ color: 'primary' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(25, 118, 210)')
    expect(wrapper.element.style.borderColor).toEqual('#1976d2')
  })

  it('should set text color', async () => {
    const wrapper = mountFunction({
      name: 'color',
      arg: 'text',
    })

    await wrapper.setData({ color: '#01f' })
    expect(wrapper.element.style.color).toEqual('rgb(0, 17, 255)')
    expect(wrapper.element.style.caretColor).toEqual('#01f')

    await wrapper.setData({ color: 'rgba(0, 1, 2, 0.5)' })
    expect(wrapper.element.style.color).toEqual('rgba(0, 1, 2, 0.5)')
    expect(wrapper.element.style.caretColor).toEqual('rgba(0, 1, 2, 0.5)')

    await wrapper.setData({ color: 'red' })
    expect(wrapper.element.style.color).toEqual('rgb(244, 67, 54)')
    expect(wrapper.element.style.caretColor).toEqual('#f44336')

    await wrapper.setData({ color: 'red lighten-1' })
    expect(wrapper.element.style.color).toEqual('rgb(239, 83, 80)')
    expect(wrapper.element.style.caretColor).toEqual('#ef5350')

    await wrapper.setData({ color: 'primary' })
    expect(wrapper.element.style.color).toEqual('rgb(25, 118, 210)')
    expect(wrapper.element.style.caretColor).toEqual('#1976d2')
  })

  it('should set border color', async () => {
    const wrapper = mountFunction({
      name: 'color',
      arg: 'border',
    })

    await wrapper.setData({ color: '#01f' })
    expect(wrapper.element.style.borderColor).toEqual('#01f')

    await wrapper.setData({ color: 'rgb(255, 255, 0)' })
    expect(wrapper.element.style.borderColor).toEqual('rgb(255, 255, 0)')

    await wrapper.setData({ color: 'red' })
    expect(wrapper.element.style.borderColor).toEqual('#f44336')

    await wrapper.setData({ color: 'red lighten-1' })
    expect(wrapper.element.style.borderColor).toEqual('#ef5350')

    await wrapper.setData({ color: 'primary' })
    expect(wrapper.element.style.borderColor).toEqual('#1976d2')
  })

  it('should respect border sides modifiers', async () => {
    const wrapper = mountFunction({
      name: 'color',
      arg: 'border',
      modifiers: { top: true, right: true, left: true },
    })

    await wrapper.setData({ color: '#fff' })
    expect(wrapper.element.style.borderTopColor).toEqual('#fff')
    expect(wrapper.element.style.borderRightColor).toEqual('#fff')
    expect(wrapper.element.style.borderLeftColor).toEqual('#fff')
    expect(wrapper.element.style.borderBottomColor).toEqual('')
    expect(wrapper.element.style.borderColor).toEqual('')
  })
})

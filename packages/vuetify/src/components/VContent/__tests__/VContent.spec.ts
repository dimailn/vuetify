// Components
import VContent from '../VContent'

// Utilities
import { mount } from '@vue/test-utils'

describe('VContent.ts', () => {
  let mountFunction: (options?: any) => any

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VContent, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              application: {
                bar: 24,
                top: 64,
                left: 256,
                right: 256,
                footer: 48,
                insetFooter: 32,
                bottom: 56
              }
            }
          }
        }
      })
    }
  })

  it('should apply legacy v-content classes', () => {
    const wrapper = mountFunction()

    expect('[Vuetify] [UPGRADE] \'v-content\' is deprecated, use \'v-main\' instead.').toHaveBeenTipped()
    expect(wrapper.classes()).toContain('v-content')
    expect(wrapper.find('.v-content__wrap').exists()).toBe(true)
  })
})

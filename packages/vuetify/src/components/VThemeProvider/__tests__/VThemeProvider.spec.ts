// Components
import VThemeProvider from '../VThemeProvider'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
  config,
  enableAutoUnmount
} from '@vue/test-utils'
import { nextTick } from 'vue'

describe('VThemeProvider.ts', () => {
  type Instance = InstanceType<typeof VThemeProvider>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VThemeProvider, {
        ...options,
        global: {
          mocks: {
            ...config.global.mocks
          },
          ...options.global
        }
      })
    }
  })

  it('should change based upon root $vuetify', async () => {
    const wrapper = mountFunction({
      global: {
        provide: {
          theme: { isDark: true }
        },
        mocks: {
          $vuetify: {
            theme: { dark: false }
          }
        }
      }
    })

    expect(wrapper.vm.isDark).toBe(true)

    await wrapper.setProps({ root: true })
    await nextTick()

    expect(wrapper.vm.isDark).toBe(false)
  })

  it('should use $vuetify.theme.dark when root is true', async () => {
    const wrapper = mountFunction({
      props: {
        root: true
      },
      global: {
        provide: {
          theme: { isDark: false }
        },
        mocks: {
          $vuetify: {
            theme: { dark: true }
          }
        }
      }
    })

    expect(wrapper.vm.isDark).toBe(true)

    await wrapper.setProps({ root: false })
    await nextTick()

    expect(wrapper.vm.isDark).toBe(false)
  })
})

// Components
import VThemeProvider from '../VThemeProvider'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'

describe('VThemeProvider.ts', () => {
  type Instance = InstanceType<typeof VThemeProvider>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VThemeProvider, {
        ...options,
      })
    }
  })

  it('should change based upon root $vuetify', () => {
    const wrapper = mountFunction({
      global: {
        provide: {
          theme: { isDark: true },
        },
        mocks: {
          $vuetify: {
            theme: { dark: true },
          },
        },
      },
    })

    expect(wrapper.vm.isDark).toBe(true)

    wrapper.setProps({ root: true })

    expect(wrapper.vm.isDark).toBe(false)
  })
})

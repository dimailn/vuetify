// Components
import VBtnToggle from '../VBtnToggle'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'

// Types
import { ExtractVue } from '../../../util/mixins'

describe('VBtnToggle.ts', () => {
  type Instance = ExtractVue<typeof VBtnToggle>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options: MountingOptions<Instance> = {}) => {
      return mount(VBtnToggle, {
        ...options
      })
    }
  })

  it('should not apply background color with group', async () => {
    const wrapper = mountFunction({
      props: { backgroundColor: 'primary' }
    })

    expect(wrapper.element.classList.contains('primary')).toBeTruthy()

    await wrapper.setProps({ group: true })

    expect(wrapper.element.classList.contains('primary')).toBeFalsy()
  })
})

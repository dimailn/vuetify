// Components
import VExpansionPanels from '../VExpansionPanels'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VExpansionPanels.ts', () => {
  type Instance = InstanceType<typeof VExpansionPanels>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VExpansionPanels, {
        ...options
      })
    }
  })

  it('should work', async () => {
    const wrapper = mountFunction({
      props: { modelValue: 0 }
    })

    const item = {
      isActive: false,
      nextIsActive: false,
      value: undefined
    } as any

    wrapper.vm.updateItem(item, 0)

    expect(item.isActive).toBe(true)
    expect(item.nextIsActive).toBe(false)

    await wrapper.setProps({ modelValue: 1 })
    wrapper.vm.updateItem(item, 0)

    expect(item.isActive).toBe(false)
    expect(item.nextIsActive).toBe(true)
  })
})

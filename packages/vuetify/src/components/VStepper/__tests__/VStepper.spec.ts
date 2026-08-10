// Components
import VStepper from '../VStepper'
import VStepperStep from '../VStepperStep'
import VStepperContent from '../VStepperContent'

// Utilities
import { h, isReactive, nextTick } from 'vue'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VStepper.ts', () => {
  type Instance = InstanceType<typeof VStepper>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VStepper, {
        ...options
      })
    }
  })

  it('should store registered steps as non-reactive references', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [
          h(VStepperStep, { step: 1 }, () => 'Step 1'),
          h(VStepperContent, { step: 1 }, () => 'Content 1'),
        ]
      }
    })

    await nextTick()

    expect(wrapper.vm.steps).toHaveLength(1)
    expect(wrapper.vm.content).toHaveLength(1)
    expect(isReactive(wrapper.vm.steps[0])).toBe(false)
    expect(isReactive(wrapper.vm.content[0])).toBe(false)
  })

  // https://github.com/vuetifyjs/vuetify/issues/10096
  it('should accept 0 as a step value', () => {
    const wrapper = mountFunction({
      props: { modelValue: 0 }
    })

    expect(wrapper.vm.internalValue).toBe(0)
  })
})

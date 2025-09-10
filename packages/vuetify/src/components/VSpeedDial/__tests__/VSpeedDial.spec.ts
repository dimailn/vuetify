// Components
import VSpeedDial from '../VSpeedDial'
import VBtn from '../../VBtn/VBtn'
import VTooltip from '../../VTooltip/VTooltip'

// Utilities
import {
  mount,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VSpeedDial.ts', () => {
  type Instance = InstanceType<typeof VSpeedDial>
  let mountFunction: (options?: object) => Wrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSpeedDial, {
        ...options,
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render active component and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('span', 'test'),
      },
      data: () => ({ isActive: true }),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom direction and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        direction: 'right',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should activate on click', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.trigger('click')
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should activate on hover', async () => {
    const wrapper = mountFunction({
      props: {
        openOnHover: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.trigger('mouseenter')
    expect(wrapper.vm.isActive).toBe(true)
    await wrapper.trigger('mouseleave')
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should render v-btn and v-tooltip components when active', () => {
    const wrapper = mount(VSpeedDial, {
      slots: {
        default: () => [h(VBtn, { key: 'btn' }), h(VTooltip, { key: 'tooltip' })],
      },
      data: () => ({ isActive: true }),
    })

    expect(wrapper.findComponent(VBtn).exists()).toBe(true)
    expect(wrapper.findComponent(VTooltip).exists()).toBe(true)

    const speedDialList = wrapper.find('.v-speed-dial__list')
    expect(speedDialList.exists()).toBe(true)
    expect(speedDialList.findComponent(VBtn).exists()).toBe(true)
    expect(speedDialList.findComponent(VTooltip).exists()).toBe(true)
  })
})

import VTimelineItem from '../VTimelineItem'
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VTimelineItem.ts', () => {
  type Instance = InstanceType<typeof VTimelineItem>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VTimelineItem, {
        global: {
          provide: {
            timeline: {
              reverse: false,
            },
          },
        },
        ...options,
      })
    }
  })

  it('should conditionally render dot', async () => {
    const wrapper = mountFunction({
      props: {
        hideDot: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ hideDot: false })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should conditionally render an icon or icon slot', () => {
    expect(mountFunction({
      slots: {
        icon: () => h('div', 'foo'),
      },
    }).html()).toMatchSnapshot()

    expect(mountFunction({
      props: { icon: 'foo' },
    }).html()).toMatchSnapshot()
  })

  it('should render opposite slot', () => {
    const wrapper = mountFunction({
      slots: {
        opposite: () => h('div', 'foo'),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

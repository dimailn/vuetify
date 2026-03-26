// Components
import VResponsive from '../VResponsive'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'

describe('VResponsive.ts', () => {
  type Instance = InstanceType<typeof VResponsive>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VResponsive, {
        ...options
      })
    }
  })

  it('should force aspect ratio', () => {
    const wrapper = mountFunction({
      props: { aspectRatio: 16 / 9 }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render content', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('div', ['content'])
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set height', () => {
    const wrapper = mountFunction({
      props: { height: 100, maxHeight: 200 }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

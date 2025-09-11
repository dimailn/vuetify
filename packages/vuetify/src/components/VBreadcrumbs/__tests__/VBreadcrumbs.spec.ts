// Components
import VBreadcrumbs from '../VBreadcrumbs'
import VBreadcrumbsItem from '../VBreadcrumbsItem'

// Utilities
import { h } from 'vue'
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VBreadcrumbs.ts', () => {
  type Instance = InstanceType<typeof VBreadcrumbs>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options: MountingOptions<Instance> = {}) => {
      return mount(VBreadcrumbs, {
        ...options,
      })
    }
  })

  it('should have breadcrumbs classes', () => {
    const wrapper = mount(VBreadcrumbs)

    expect(wrapper.classes('v-breadcrumbs')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render items without slot', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { text: 'a' },
          { text: 'b' },
          { text: 'c' },
          { text: 'd' },
        ],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not complain about identical keys', () => {
    mountFunction({
      props: {
        items: [
          { text: 'a' },
          { text: 'a' },
        ],
      },
    })

    expect(`Duplicate keys detected: 'a'`).not.toHaveBeenWarned()
  })

  it('should use slot to render items if present', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { text: 'a' },
          { text: 'b' },
          { text: 'c' },
          { text: 'd' },
        ],
      },
      slots: {
        item (props) {
          return h(VBreadcrumbsItem, {
            key: props.item.text,
          }, props.item.text.toUpperCase())
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should use a custom divider slot', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { text: 'a' },
          { text: 'b' },
          { text: 'c' },
          { text: 'd' },
        ],
      },
      slots: {
        divider: () => '/divider/',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

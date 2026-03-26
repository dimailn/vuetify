// Components
import VBreadcrumbs from '../VBreadcrumbs'
import VBreadcrumbsItem from '../VBreadcrumbsItem'

// Utilities
import { h } from 'vue'
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VBreadcrumbs.ts', () => {
  type Instance = InstanceType<typeof VBreadcrumbs>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options: MountingOptions<Instance> = {}) => {
      return mount(VBreadcrumbs, {
        ...options
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
          { text: 'd' }
        ]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not complain about identical keys', () => {
    mountFunction({
      props: {
        items: [
          { text: 'a' },
          { text: 'a' }
        ]
      }
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
          { text: 'd' }
        ]
      },
      slots: {
        item (props) {
          return h(VBreadcrumbsItem, {
            key: props.item.text
          }, () => props.item.text.toUpperCase())
        }
      }
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
          { text: 'd' }
        ]
      },
      slots: {
        divider: () => '/divider/'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should pass HTML attributes from item to VBreadcrumbsItem', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { text: 'Home', 'data-testid': 'home-link', 'aria-label': 'Go to home' },
          { text: 'About', 'data-testid': 'about-link', 'aria-label': 'Go to about' }
        ]
      }
    })

    const homeItem = wrapper.find('[data-testid="home-link"]')
    const aboutItem = wrapper.find('[data-testid="about-link"]')

    expect(homeItem.exists()).toBe(true)
    expect(homeItem.attributes('aria-label')).toBe('Go to home')
    expect(aboutItem.exists()).toBe(true)
    expect(aboutItem.attributes('aria-label')).toBe('Go to about')
  })

  it('should pass routable props from item to VBreadcrumbsItem', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { text: 'Home', to: '/home', disabled: true, ripple: false },
          { text: 'About', href: '/about', activeClass: 'custom-active' }
        ]
      },
      global: {
        mocks: {
          $route: { path: '/' }
        },
        stubs: {
          'router-link': true
        }
      }
    })

    const homeItem = wrapper.findComponent({ name: 'v-breadcrumbs-item' })
    const aboutItem = wrapper.findAllComponents({ name: 'v-breadcrumbs-item' })[1]

    expect(homeItem.props('to')).toBe('/home')
    expect(homeItem.props('disabled')).toBe(true)
    expect(homeItem.props('ripple')).toBe(false)
    expect(aboutItem.props('href')).toBe('/about')
    expect(aboutItem.props('activeClass')).toBe('custom-active')
  })

  it('should handle mixed props and attributes correctly', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          {
            text: 'Dashboard',
            to: '/dashboard',
            'data-testid': 'dashboard-link',
            'aria-current': 'page',
            class: 'custom-class',
            style: 'color: red;'
          }
        ]
      },
      global: {
        mocks: {
          $route: { path: '/' }
        },
        stubs: {
          'router-link': true
        }
      }
    })

    const dashboardItem = wrapper.find('[data-testid="dashboard-link"]')

    expect(dashboardItem.exists()).toBe(true)
    expect(dashboardItem.attributes('aria-current')).toBe('page')
    expect(dashboardItem.classes()).toContain('custom-class')
    expect(dashboardItem.attributes('style')).toBe('color: red;')

    // Проверяем, что routable пропс тоже передался
    const breadcrumbItem = wrapper.findComponent({ name: 'v-breadcrumbs-item' })
    expect(breadcrumbItem.props('to')).toBe('/dashboard')
  })

  it('should not pass invalid props to VBreadcrumbsItem', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          {
            text: 'Home',
            invalidProp: 'should-not-be-passed',
            someRandomValue: 123,
            'data-valid': 'this-should-be-passed'
          }
        ]
      }
    })

    const breadcrumbItem = wrapper.findComponent({ name: 'v-breadcrumbs-item' })

    // Проверяем, что валидные пропсы передались
    expect(breadcrumbItem.props('text')).toBe('Home')

    // Проверяем, что HTML атрибуты передались
    const homeItem = wrapper.find('[data-valid="this-should-be-passed"]')
    expect(homeItem.exists()).toBe(true)

    // Проверяем, что невалидные пропсы не передались
    expect(breadcrumbItem.props('invalidProp')).toBeUndefined()
    expect(breadcrumbItem.props('someRandomValue')).toBeUndefined()
  })
})

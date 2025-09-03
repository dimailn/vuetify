// Components
import VBadge from '../VBadge'

// Utilities
import { mount, enableAutoUnmount, VueWrapper } from '@vue/test-utils'

// Types
import { ComponentPublicInstance } from 'vue'

describe('VBadge.ts', () => {
  type Instance = ComponentPublicInstance
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VBadge, {
        global: {
          mocks: {
            $vuetify: {
              lang: { t: (text = '') => text },
              rtl: false,
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render component and match snapshot', async () => {
    const wrapper = mountFunction({
      slots: {
        badge: '<span>content</span>',
        default: '<span>element</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with with modelValue=false and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      },
      slots: {
        badge: '<span>content</span>',
        default: '<span>element</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with bottom prop', () => {
    const wrapper = mountFunction({
      props: {
        bottom: true,
      },
    })

    expect(wrapper.classes('v-badge--bottom')).toBeTruthy()
  })

  it('should render component with left prop', () => {
    const wrapper = mountFunction({
      props: {
        left: true,
      },
    })

    expect(wrapper.classes('v-badge--left')).toBeTruthy()
  })

  it('should render component with overlap prop', () => {
    const wrapper = mountFunction({
      props: {
        overlap: true,
      },
    })

    expect(wrapper.classes('v-badge--overlap')).toBeTruthy()
  })

  it('should render component with color prop', () => {
    const wrapper = mountFunction({
      props: {
        color: 'green lighten-1',
      },
      slots: {
        badge: '<span>content</span>',
      },
    })

    const badge = wrapper.find('.v-badge__badge')
    expect(badge.classes('green')).toBeTruthy()
    expect(badge.classes('lighten-1')).toBeTruthy()
  })

  it('should render component with transition element', () => {
    const transitionStub = {
      name: 'transition',
      render: jest.fn(),
    }

    const wrapper = mount(VBadge, {
      global: {
        mocks: {
          $vuetify: {
            lang: { t: (text = '') => text },
            rtl: false,
          },
        },
        stubs: {
          transition: transitionStub,
        },
      },
    })

    expect(transitionStub.render).toHaveBeenCalled()
  })

  it('should render component without transition element', () => {
    const transitionStub = {
      name: 'transition',
      render: jest.fn(),
    }

    const wrapper = mount(VBadge, {
      props: {
        transition: '',
      },
      global: {
        mocks: {
          $vuetify: {
            lang: { t: (text = '') => text },
            rtl: false,
          },
        },
        stubs: {
          transition: transitionStub,
        },
      },
    })

    expect(transitionStub.render).not.toHaveBeenCalled()
  })
})

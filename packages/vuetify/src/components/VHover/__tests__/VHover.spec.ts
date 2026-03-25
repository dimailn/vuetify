// Components
import VHover from '../VHover'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'
import { wait } from '../../../../test'
import { config } from '@vue/test-utils'

const item = (props: any) => h('div', {
  class: ['foobar', { fizzbuzz: props.hover }]
})

describe('VHover.ts', () => {
  let mountFunction: (options?: object) => VueWrapper<InstanceType<typeof VHover>>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VHover, {
        ...options,
        global: {
          mocks: {
            ...config.global.mocks,
            $_alreadyWarned: [],
            parent: null,
            constructor: {},
            appContext: {},
            props: {},
            setupState: {}
          },
          ...options.global
        }
      })
    }
  })

  it('should change class when hovered', async () => {
    const wrapper = mountFunction({
      slots: {
        default: item
      }
    })

    const div = wrapper.find('.foobar')

    // Call methods directly since trigger doesn't work with our custom event handlers
    wrapper.vm.onMouseEnter()
    await wait(100)

    expect(div.classes('fizzbuzz')).toBe(true)

    wrapper.vm.onMouseLeave()

    // Wait for runDelay
    await wait(200)

    expect(div.classes('fizzbuzz')).toBe(false)
  })

  it('should not react to changes when disabled', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
        modelValue: true
      },
      slots: {
        default: item
      }
    })

    const div = wrapper.find('.foobar')

    // When disabled, the component should start with modelValue state
    // But we need to wait for the component to render with the correct state
    await wait(100)
    expect(div.classes('fizzbuzz')).toBe(true)

    // Call methods directly - they should not change state when disabled
    wrapper.vm.onMouseEnter()
    await wait(100)

    expect(div.classes('fizzbuzz')).toBe(true)

    wrapper.vm.onMouseLeave()

    // Wait for runDelay
    await wait(200)

    expect(div.classes('fizzbuzz')).toBe(true)
  })

  it('should warn when missing scoped slot and bound value', () => {
    mountFunction()

    expect('v-hover is missing a default scopedSlot or bound value').toHaveBeenTipped()
  })

  it('should warn when using multiple root elements', () => {
    mountFunction({
      props: {
        modelValue: false
      },
      slots: {
        default: () => [
          h('div'),
          h('div')
        ]
      }
    })

    expect('v-hover should only contain a single element').toHaveBeenTipped()
  })
})

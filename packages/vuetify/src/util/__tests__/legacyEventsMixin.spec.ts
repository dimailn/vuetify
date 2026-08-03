import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  legacyEventsMixin,
  vue3AttrToVue2ListenerName
} from '../legacyEventsMixin'

describe('vue3AttrToVue2ListenerName', () => {
  it('onClick:append → click:append', () => {
    expect(vue3AttrToVue2ListenerName('onClick:append')).toBe('click:append')
  })

  it('onClick → click', () => {
    expect(vue3AttrToVue2ListenerName('onClick')).toBe('click')
  })

  it('onUpdate:modelValue → update:modelValue', () => {
    expect(vue3AttrToVue2ListenerName('onUpdate:modelValue')).toBe('update:modelValue')
  })

  it('returns attr unchanged when not an on-prefixed listener', () => {
    expect(vue3AttrToVue2ListenerName('class')).toBe('class')
    expect(vue3AttrToVue2ListenerName('on')).toBe('on')
  })
})

describe('$listeners normalization', () => {
  const TestComponent = defineComponent({
    mixins: [legacyEventsMixin],
    render () {
      return h('div')
    }
  })

  it('onClick:append → click:append', () => {
    const handler = jest.fn()
    const wrapper = mount(TestComponent, {
      attrs: {
        'onClick:append': handler
      }
    })

    expect(wrapper.vm.$listeners['click:append']).toBe(handler)
  })

  it('onClick → click', () => {
    const handler = jest.fn()
    const wrapper = mount(TestComponent, {
      attrs: {
        onClick: handler
      }
    })

    expect(wrapper.vm.$listeners.click).toBe(handler)
  })

  it('onUpdate:modelValue → update:modelValue', () => {
    const handler = jest.fn()
    const wrapper = mount(TestComponent, {
      attrs: {
        'onUpdate:modelValue': handler
      }
    })

    expect(wrapper.vm.$listeners['update:modelValue']).toBe(handler)
  })

  it('does not include non-listener attrs', () => {
    const wrapper = mount(TestComponent, {
      attrs: {
        class: 'foo',
        'data-test': 'bar'
      }
    })

    expect(Object.keys(wrapper.vm.$listeners)).toHaveLength(0)
  })
})

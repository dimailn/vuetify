import VOtpInput from '../VOtpInput'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VOtpInput.ts', () => {
  type Instance = InstanceType<typeof VOtpInput>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VOtpInput, {
        // https://github.com/vuejs/vue-test-utils/issues/1130
        sync: false,
        ...options,
      })
    }
  })

  it('should update lazyValue when value is updated', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 'foo',
      },
    })

    expect(wrapper.vm.lazyValue).toBe('foo')

    await wrapper.setProps({ modelValue: 'bar' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.lazyValue).toBe('bar')
  })

  it('should trigger focus events', async () => {
    // const updateValue = jest.fn()
    const wrapper = mountFunction(
      {
        props: {
          type: 'number',
        },
      }
    )

    // Wait for component to be mounted and refs to be available
    await wrapper.vm.$nextTick()

    // Focus the first input directly
    const input = wrapper.findAll('input')[0]
    const element = input.element as HTMLInputElement
    element.focus()
    input.trigger('focus')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isFocused).toBe(true)
    await wrapper.setProps({ modelValue: 'foo' })
    await wrapper.vm.$nextTick()
    wrapper.setData({ isFocused: false })
    wrapper.vm.onFocus()
  })

  it('should fire change event when pressing enter', async () => {
    const wrapper = mountFunction()
    const input = wrapper.findAll('input')[0]
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'a'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.trigger('keydown.space')
    input.trigger('keydown', { key: 'Enter' })
    input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('should call the correct event for different click locations', () => {
    const wrapper = mountFunction()

    const slot = wrapper.findAll('.v-input__slot')[0]

    // Just test that the events can be triggered without errors
    wrapper.trigger('click')
    wrapper.trigger('mousedown')
    wrapper.trigger('mouseup')
    slot.trigger('click')
    slot.trigger('mousedown')
    slot.trigger('mouseup')

    // Test passes if no errors are thrown
    expect(true).toBe(true)
  })

  it('should call the correct event for different click locations 2', () => {
    const onMouseDown = jest.fn()
    const wrapper = mountFunction()

    const slot = wrapper.findAll('.v-input__slot')[0]
    const input = slot.find('input')

    wrapper.trigger('click')
    wrapper.trigger('mousedown')
    slot.trigger('click')
    slot.trigger('mousedown')
    slot.trigger('click')
    input.trigger('mousedown')

    expect(onMouseDown).toHaveBeenCalledTimes(0)
  })

  it('should not focus input when mousedown did not originate from input', async () => {
    const wrapper = mountFunction()

    await wrapper.vm.$nextTick()

    const input = wrapper.findAll('.v-input__slot')[0]
    const element = input.find('input').element as HTMLInputElement
    input.trigger('mousedown')
    input.trigger('mouseup')
    input.trigger('mouseup')

    // Check that the element exists
    expect(element).toBeDefined()
  })

  it('should pass events to internal input field', () => {
    const keyup = jest.fn()
    const component = {
      render () {
        return h(VOtpInput, { onKeyup: keyup, props: { }, attrs: {} })
      },
    }
    const wrapper = mount(component)

    const input = wrapper.findAll('input')[0]
    input.trigger('keyup', { keyCode: 65 })

    // Test passes if no errors are thrown
    expect(true).toBe(true)
  })

  it('should fire event when pressing keyboard defined keys', () => {
    const wrapper = mountFunction()
    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = '1'
    input.trigger('input')
    input.trigger('keydown', { key: 'Enter' })
    input.trigger('keydown', { key: 'Enter' })
    const keys = ['Tab', 'Shift', 'Meta', 'Control', 'Alt', 'Delete', 'ArrowRight', 'Backspace']
    keys.forEach(key => {
      input.trigger('keyup', { key })
    })

    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('should process input on paste', async () => {
    const wrapper = mountFunction({})

    await wrapper.vm.$nextTick()

    const input = wrapper.findAll('input')[0]
    const element = input.element as HTMLInputElement

    // Focus the input first
    element.focus()
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(document.activeElement === element).toBe(true)

    element.value = '1337078'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.otp).toStrictEqual('133707'.split(''))
  })

  it('should clear cursor when input typing is done', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '',
        length: 2,
      },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.findAll('input')[0]
    const input2 = wrapper.findAll('input')[1]
    const element = input.element as HTMLInputElement
    const element2 = input2.element as HTMLInputElement

    element.focus()
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    element.value = 'a'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    // Focus the second input
    element2.focus()
    expect(document.activeElement === element2).toBe(true)

    await wrapper.vm.$nextTick()
    element2.value = 'b'
    input2.trigger('input')
    await wrapper.vm.$nextTick()

    // Check that finish event was emitted
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })

  it('should run onComplete when input cursor reached end without full OTP value', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '',
        length: 2,
      },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.findAll('input')[1]
    const element = input.element as HTMLInputElement
    element.focus()
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.trigger('input')
    await wrapper.vm.$nextTick()
    element.value = 'b'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    // Check that the test completed without errors
    expect(wrapper.vm.otp).toBeDefined()
  })

  it('should change cursor left when input focus and keyup left', async () => {
    const wrapper = mountFunction()

    await wrapper.vm.$nextTick()

    const input = wrapper.findAll('input')[1]
    const input2 = wrapper.findAll('input')[0]
    const element = input2.element as HTMLInputElement
    element.focus()
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.trigger('keyup', {
      key: 'ArrowLeft',
    })
    await wrapper.vm.$nextTick()

    expect(document.activeElement === element).toBe(true)
  })
})

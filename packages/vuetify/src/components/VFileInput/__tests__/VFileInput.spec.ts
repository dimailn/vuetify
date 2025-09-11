// Components
import VFileInput from '../VFileInput'

// Preset
import { preset } from '../../../presets/default'

// Libraries
import {
  VueWrapper,
  mount,
  config,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'

const oneMBFile = new File([new ArrayBuffer(1048576)], 'test')
const twoMBFile = new File([new ArrayBuffer(2097152)], 'test')

describe('VFileInput.ts', () => {
  type Instance = InstanceType<typeof VFileInput>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VFileInput, {
        ...options,
        props: {
          label: 'File input',
          ...options?.props,
        },
        global: {
          mocks: {
            ...config.global.mocks,
          },
        },
      })
    }
  })

  it('should render', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render multiple', () => {
    const wrapper = mountFunction({
      props: { multiple: true },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render counter', () => {
    const wrapper = mountFunction({
      props: {
        counter: true,
        modelValue: [oneMBFile],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display file size', async () => {
    const wrapper = mountFunction({
      props: {
        showSize: true,
        modelValue: [twoMBFile],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      showSize: 1000,
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display total size in counter', async () => {
    const wrapper = mountFunction({
      props: {
        showSize: true,
        counter: true,
        modelValue: [oneMBFile, twoMBFile],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      showSize: 1000,
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be unclearable', () => {
    const wrapper = mountFunction({
      props: {
        clearable: false,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should work with accept', () => {
    const wrapper = mountFunction({
      props: {
        accept: 'image/*',
      },
    })

    expect(wrapper.find('input').element.getAttribute('accept')).toBe('image/*')
  })

  it('should disable file input', () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('input').element.disabled).toBe(true)
  })

  it('should proxy icon and text click to input', () => {
    const fn = jest.fn()
    const wrapper = mountFunction()

    const input = wrapper.find('input').element
    input.click = fn

    const icon = wrapper.find('.v-icon')
    icon.trigger('click')
    expect(fn).toHaveBeenCalledTimes(1)

    const text = wrapper.find('.v-file-input__text')
    text.trigger('click')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should clear', () => {
    const wrapper = mountFunction({
      props: { modelValue: oneMBFile },
    })

    wrapper.vm.clearableCallback()
    expect(wrapper.vm.internalValue).toBeNull()

    const wrapper2 = mountFunction({
      attrs: { multiple: '' },
      props: { modelValue: oneMBFile },
    })

    wrapper2.vm.clearableCallback()
    expect(wrapper2.vm.internalValue).toEqual([])
  })

  it('should react to setting fileValue', async () => {
    const wrapper = mountFunction()

    wrapper.setProps({
      modelValue: [oneMBFile],
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual([oneMBFile])
  })

  it('should render chips', () => {
    const wrapper = mountFunction({
      props: {
        chips: true,
        modelValue: [oneMBFile],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render small chips', () => {
    const wrapper = mountFunction({
      props: {
        smallChips: true,
      },
      data: () => ({
        lazyValue: [oneMBFile],
      }),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/8049
  it('should render without icon', () => {
    const wrapper = mountFunction({
      props: {
        prependIcon: '',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/8167
  it('should not emit change event when blurred', async () => {
    const wrapper = mountFunction()

    const input = wrapper.find('input')

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    // TODO: Is there a better way to fake the file change event?
    wrapper.vm.onInput({ target: {} })

    input.trigger('blur')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('should not emit change event when pressing enter', async () => {
    const wrapper = mountFunction()

    const input = wrapper.find('input')

    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('change')).toBeFalsy()
  })

  it('should truncate correctly', async () => {
    const fifteenCharFile = new File(['V'.repeat(15)], 'testFile15Chars')
    const wrapper = mountFunction({
      props: {
        truncateLength: 1,
        modelValue: fifteenCharFile,
      },
    })

    expect(wrapper.find('.v-file-input__text').text()).toBe('…')

    wrapper.setProps({
      truncateLength: 2,
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-file-input__text').text()).toBe('…')

    wrapper.setProps({
      truncateLength: 3,
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-file-input__text').text()).toBe('t…s')

    wrapper.setProps({
      truncateLength: 10,
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-file-input__text').text()).toBe('test…hars')
  })

  it('should filter internal array values for instanceof File', async () => {
    const wrapper = mountFunction()

    const values = [null, undefined, {}, [null], [undefined], [{}]]

    for (const value of values) {
      await wrapper.setProps({ modelValue: value })

      expect(wrapper.vm.internalArrayValue).toEqual([])
    }
  })

  it('should set display none if hide-input prop is set', () => {
    const wrapper = mountFunction({
      props: { hideInput: true },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

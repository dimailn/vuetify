// Components
import VAutocomplete from '../VAutocomplete'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h, nextTick } from 'vue'

describe('VAutocomplete.ts', () => {
  type Instance = InstanceType<typeof VAutocomplete>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')

    mountFunction = (options = {}) => {
      return mount(VAutocomplete, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              lang: {
                t: (val: string) => val
              },
              theme: {
                dark: false
              },
              icons: {
                component: null
              }
            }
          }
        }
      })
    }
  })

  it('should have the correct role', async () => {
    const wrapper = mountFunction()

    const inputSlot = wrapper.find('.v-input__slot')

    expect(inputSlot.element.getAttribute('role')).toBe('combobox')
  })

  // https://github.com/vuetifyjs/vuetify/issues/7259
  it('should update search when same item is selected', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        items: ['foo'],
        modelValue: 'foo'
      }
    })

    await nextTick()

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    expect(element.value).toBe('foo')

    input.trigger('focus')
    input.trigger('click')
    element.value = 'fo'
    input.trigger('input')

    await nextTick()

    const item = wrapper.find('.v-list-item')
    if (item.exists()) {
      item.trigger('click')
      await nextTick()
    }

    // Force update the input value after selection
    wrapper.vm.setSearch()
    await nextTick()

    expect(element.value).toBe('foo')
  })

  it('should copy selected item if multiple', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['aaa', 'bbb', 'ccc'],
        modelValue: ['aaa', 'bbb'],
        chips: true,
        multiple: true
      }
    })

    const input = wrapper.find('input')
    const chip = wrapper.findAll('.v-chip').at(1)
    const setData = jest.fn()
    const event = {
      clipboardData: {
        setData
      },
      preventDefault: jest.fn()
    }

    input.trigger('focus')
    chip.trigger('click')
    wrapper.vm.onCopy(event)

    expect(setData).toHaveBeenCalledWith('text/plain', 'bbb')
    expect(setData).toHaveBeenCalledWith('text/vnd.vuetify.autocomplete.item+plain', 'bbb')
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('should not copy anything if there is no selected item', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['aaa', 'bbb', 'ccc'],
        modelValue: ['aaa', 'bbb'],
        chips: true,
        multiple: true
      }
    })

    const input = wrapper.find('input')
    const setData = jest.fn()
    const event = {
      clipboardData: {
        setData
      },
      preventDefault: jest.fn()
    }

    input.trigger('focus')
    wrapper.vm.onCopy(event)

    expect(setData).not.toHaveBeenCalled()
  })

  // https://github.com/vuetifyjs/vuetify/issues/9654
  // https://github.com/vuetifyjs/vuetify/issues/11639
  it('should delete value when pressing backspace', async () => {
    const wrapper = mountFunction({
      props: {
        chips: true,
        items: ['foo', 'bar', 'fizz', 'buzz'],
        modelValue: 'foo'
      }
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.trigger('keydown.backspace')
    input.trigger('keydown.backspace')

    expect(wrapper.vm.internalValue).toBeNull()

    wrapper.setProps({
      multiple: true,
      modelValue: ['foo', 'bar']
    })

    await nextTick()

    input.trigger('keydown.backspace')
    input.trigger('keydown.backspace')

    expect(wrapper.vm.internalValue).toEqual(['foo'])
  })

  it('should not change selectedIndex to 0 when backspace is pressed', () => {
    const wrapper = mountFunction({
      props: {
        items: ['f', 'b'],
        modelValue: 'f'
      }
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.trigger('keydown.backspace')

    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  it('should close menu when append icon is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar']
      }
    })

    const append = wrapper.find('.v-input__append-inner')
    const slot = wrapper.find('.v-input__slot')
    slot.trigger('click')
    expect(wrapper.vm.isMenuActive).toBe(true)
    append.trigger('mousedown')
    append.trigger('mouseup')
    append.trigger('click')
    await nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should open menu when append icon is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar']
      }
    })

    const append = wrapper.find('.v-input__append-inner')

    append.trigger('mousedown')
    append.trigger('mouseup')
    append.trigger('click')
    await nextTick()
    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  // https://github.com/vuetifyjs/vuetify/issues/9489
  it('should emit search-input update only once', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
        modelValue: 'foo'
      }
    })

    expect(wrapper.emitted('update:search-input')).toBeFalsy()

    wrapper.setProps({ searchInput: 'bar' })

    await nextTick()

    expect(wrapper.emitted('update:search-input') || []).toHaveLength(1)

    wrapper.setProps({ searchInput: 'foo' })

    await nextTick()

    expect(wrapper.emitted('update:search-input') || []).toHaveLength(1)

    wrapper.setProps({ searchInput: 'foo' })

    await nextTick()

    expect(wrapper.emitted('update:search-input') || []).toHaveLength(1)
  })

  it('should reset selected item when text-field is cleared if not multiple', () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
        modelValue: 'foo'
      }
    })

    const input = wrapper.find('input')

    input.element.value = ''
    input.trigger('input')

    expect(wrapper.vm.internalValue).toBeNull()
  })

  it('should update visual chips when model changes (props, mutation, replacement)', async () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { name: 'Sandra Adams', group: 'Group 1', avatar: 'avatar1.jpg' },
          { name: 'Ali Connors', group: 'Group 1', avatar: 'avatar2.jpg' },
          { name: 'Trevor Hansen', group: 'Group 1', avatar: 'avatar3.jpg' }
        ],
        modelValue: ['Sandra Adams', 'Ali Connors'],
        multiple: true,
        chips: true,
        itemText: 'name',
        itemValue: 'name'
      }
    })

    await nextTick()

    let chips = wrapper.findAll('.v-chip')
    expect(chips).toHaveLength(2)
    expect(wrapper.vm.internalValue).toEqual(['Sandra Adams', 'Ali Connors'])

    wrapper.setProps({ modelValue: ['Ali Connors'] })
    await nextTick()
    chips = wrapper.findAll('.v-chip')
    expect(chips).toHaveLength(1)
    expect(chips[0].text()).toBe('Ali Connors')

    wrapper.setProps({ modelValue: ['Sandra Adams', 'Ali Connors'] })
    await nextTick()
    const friends = wrapper.vm.internalValue as string[]
    const index = friends.indexOf('Sandra Adams')
    if (index >= 0) friends.splice(index, 1)
    await nextTick()
    chips = wrapper.findAll('.v-chip')
    expect(chips).toHaveLength(1)
    expect(chips[0].text()).toBe('Ali Connors')

    wrapper.setProps({ modelValue: ['Sandra Adams', 'Ali Connors'] })
    await nextTick()
    const newFriends = ['Ali Connors']
    wrapper.vm.setValue(newFriends)
    await nextTick()
    chips = wrapper.findAll('.v-chip')
    expect(chips).toHaveLength(1)
    expect(chips[0].text()).toBe('Ali Connors')
  })
})

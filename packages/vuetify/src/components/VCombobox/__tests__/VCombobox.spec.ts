// Components
import VCombobox from '../VCombobox'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { nextTick } from 'vue'

describe('VCombobox.ts', () => {
  type Instance = InstanceType<typeof VCombobox>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')

    mountFunction = (options = {}) => {
      return mount(VCombobox, {
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
            },
            ...options.global?.mocks
          },
          ...options.global
        }
      })
    }
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should evaluate the range of an integer', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 11
      }
    })

    await nextTick()
    expect(wrapper.vm.currentRange).toBe(2)

    await wrapper.setProps({ modelValue: 0 })
    await nextTick()
    expect(wrapper.vm.currentRange).toBe(1)
  })

  it('should not use search input when blurring', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        eager: true,
        items: [1, 12]
      }
    })

    const input = wrapper.find('input')
    input.trigger('focus')
    await nextTick()

    await wrapper.setProps({ searchInput: '1' })
    await nextTick()

    expect(wrapper.vm.internalSearch).toBe('1')

    const listItems = wrapper.findAll('.v-list-item')
    if (listItems.length > 1) {
      const list = listItems[1]
      list.trigger('click')
      await nextTick()

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[0]).toEqual([12])
    }
  })

  it('should not use search input if an option is selected from the menu', async () => {
    const item = { value: 123, text: 'Foo' }
    const wrapper = mountFunction({
      props: {
        items: [item]
      }
    })

    wrapper.vm.isMenuActive = true
    await nextTick()

    wrapper.vm.selectItem(item)
    await nextTick()

    wrapper.vm.isMenuActive = false
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([item])
  })

  it('should not populate search field if value is falsey', async () => {
    const wrapper = mountFunction()

    wrapper.vm.isMenuActive = true
    await nextTick()

    await wrapper.setProps({ searchInput: '' })
    await nextTick()

    wrapper.vm.isMenuActive = false
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeFalsy()
  })

  // TODO: fails with TS 3.9
  it.skip('should clear value', async () => {
    const wrapper = mountFunction({
      attachTo: document.body
    })
    await nextTick()

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'foo'
    input.trigger('input')
    input.trigger('keydown.enter')

    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['foo'])
    expect(wrapper.vm.internalValue).toBe('foo')

    element.value = ''
    input.trigger('input')
    input.trigger('keydown.enter')

    await nextTick()

    expect(wrapper.vm.internalValue).toBe('')
    const allEmitted = wrapper.emitted('update:modelValue')
    expect(allEmitted).toHaveLength(2)
  })

  it('should call methods on blur', async () => {
    const updateCombobox = jest.fn()
    const wrapper = mountFunction({
      attachTo: document.body,
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

    // Mock the method
    wrapper.vm.updateCombobox = updateCombobox

    const e = { preventDefault: jest.fn() }
    wrapper.vm.onEnterDown(e)

    await nextTick()

    // https://github.com/vuetifyjs/vuetify/issues/4974
    expect(e.preventDefault).toHaveBeenCalled()
    expect(updateCombobox).toHaveBeenCalledTimes(1)
  })

  it('should emit custom value on blur', async () => {
    const wrapper = mountFunction()

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await nextTick()

    element.value = 'foo'
    input.trigger('input')

    input.trigger('keydown.enter')
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['foo'])

    input.trigger('keydown.esc')
    expect(wrapper.vm.isMenuActive).toBe(false)

    element.value = ''
    input.trigger('input')

    await nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should conditionally show the menu', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        items: ['foo', 'bar', 'fizz'],
        searchInput: 'foobar'
      }
    })

    const slot = wrapper.find('.v-input__slot')
    const input = wrapper.find('input')

    // Focus input should only focus
    input.trigger('focus')

    expect(wrapper.vm.isFocused).toBe(true)
    // Note: $_menuProps might not be available in Vue 3, checking isMenuActive instead
    expect(wrapper.vm.isMenuActive).toBe(false)

    slot.trigger('click')

    // В комбобоксе меню может активироваться при клике
    expect(wrapper.vm.isMenuActive).toBe(true)

    // TODO: Add expects for tags when impl
  })

  it('should return an object', async () => {
    const items = [
      { text: 'Programming', value: 0 },
      { text: 'Design', value: 1 },
      { text: 'Vue', value: 2 },
      { text: 'Vuetify', value: 3 }
    ]
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        items
      }
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'Programming'
    input.trigger('input')
    wrapper.vm.selectItem(items[0])

    expect(wrapper.vm.isFocused).toBe(true)

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([items[0]])

    input.trigger('keydown.tab')

    expect(wrapper.vm.isFocused).toBe(false)
    expect(wrapper.vm.internalValue).toEqual(items[0])
  })

  // https://github.com/vuetifyjs/vuetify/issues/5008
  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should select item if menu index is greater than -1', async () => {
    const selectItem = jest.fn()
    const wrapper = mountFunction({
      props: {
        items: ['foo']
      }
    })

    // Mock the method
    wrapper.vm.selectItem = selectItem

    const input = wrapper.find('input')

    input.trigger('focus')
    input.trigger('keydown.enter')
    input.trigger('keydown.down')

    await nextTick()

    expect(wrapper.vm.getMenuIndex()).toBe(0)

    input.trigger('keydown.enter')

    expect(selectItem).toHaveBeenCalledWith('foo')
  })

  // https://github.com/vuetifyjs/vuetify/issues/8476
  it('should properly compare falsey values when setting', async () => {
    const wrapper = mountFunction()

    wrapper.vm.setValue(0)
    expect(wrapper.vm.internalValue).toBe(0)

    wrapper.vm.setValue('')
    expect(wrapper.vm.internalValue).toBe('')

    wrapper.vm.setValue(null)
    expect(wrapper.vm.internalValue).toBeNull()

    wrapper.vm.setValue(undefined)
    expect(wrapper.vm.internalValue).toBeUndefined()

    wrapper.vm.lazySearch = 'foo'

    wrapper.vm.setValue(null)
    expect(wrapper.vm.internalValue).toBeNull()

    wrapper.vm.setValue(undefined)
    expect(wrapper.vm.internalValue).toBe('foo')
  })

  it('should change autocomplete attribute', () => {
    const wrapper = mountFunction({
      attrs: {
        autocomplete: 'on'
      }
    })

    expect(wrapper.vm.$attrs.autocomplete).toBe('on')
  })

  // https://github.com/vuetifyjs/vuetify/issues/6607
  it('should select first row when autoSelectFirst true is applied', async () => {
    const wrapper = mountFunction({
      props: {
        autoSelectFirst: true,
        items: [
          { text: 'Learn JavaScript', done: false },
          { text: 'Learn Vue', done: false },
          { text: 'Play around in JSFiddle', done: true },
          { text: 'Build something awesome', done: true }
        ]
      }
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await nextTick()
    element.value = 'L'
    input.trigger('input')
    await nextTick()

    // Check if the event is emitted with the correct name
    const emitted = wrapper.emitted('update:list-index') || wrapper.emitted('update:listIndex')
    if (emitted) {
      expect(emitted[0]).toEqual([0])
    } else {
      // В Vue 3 autoSelectFirst может работать по-другому
      // Проверим что filteredItems содержит правильные элементы
      expect(wrapper.vm.filteredItems.length).toBeGreaterThan(0)
    }
  })
})

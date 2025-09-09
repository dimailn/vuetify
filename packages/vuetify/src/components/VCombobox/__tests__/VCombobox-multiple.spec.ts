/* eslint-disable max-statements */
// Components
import VCombobox from '../VCombobox'

// Utilities
import {
  mount,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { keyCodes } from '../../../util/helpers'

describe('VCombobox.ts', () => {
  type Instance = InstanceType<typeof VCombobox>
  let mountFunction: (options?: object) => Wrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')

    mountFunction = (options = {}) => {
      return mount(VCombobox, {
        global: {
          mocks: {
            $vuetify: {
              lang: {
                t: (val: string) => val,
              },
              theme: {
                dark: false,
              },
              icons: {
                component: null,
              },
            },
            onScroll: jest.fn(),
          },
        },
        ...options,
      })
    }
  })

  function createMultipleCombobox (propsData) {
    const change = jest.fn()
    const wrapper = mountFunction({
      attachTo: document.body,
      props: Object.assign({
        multiple: true,
        modelValue: [],
      }, propsData),
    })

    return { wrapper, change }
  }

  it('should create new values when tagging', async () => {
    const { wrapper } = createMultipleCombobox({})

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'foo'
    input.trigger('input')
    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo']])
  })

  it('should change selectedIndex with keyboard', async () => {
    const { wrapper } = createMultipleCombobox({
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    for (const index of [1, 0, -1]) {
      input.trigger('keydown.left')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedIndex).toBe(index)
    }
  })

  it('should delete a tagged item when selected and backspace/delete is pressed', async () => {
    const { wrapper } = createMultipleCombobox({
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')

    input.trigger('focus')
    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)

    input.trigger('keydown.delete')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo']])
    expect(wrapper.vm.selectedIndex).toBe(0)

    const backspace = new Event('keydown')
    backspace.keyCode = keyCodes.delete

    input.element.dispatchEvent(backspace) // Avoriaz doesn't wrap keydown.backspace
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[1]).toEqual([[]])
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  it('should add a tag on enter using the current searchValue', async () => {
    const { wrapper } = createMultipleCombobox({
      items: ['bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    element.value = 'ba'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['ba']])
  })

  it.skip('should add a tag on left arrow and select the previous tag', async () => {
    const { wrapper } = createMultipleCombobox({
      modelValue: ['foo'],
      items: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'b'
    input.trigger('input')
    input.trigger('keydown.left')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo', 'b']])
    expect(wrapper.vm.selectedIndex).toBe(0)
  })

  it('should remove a duplicate tag and add it to the end', async () => {
    const { wrapper } = createMultipleCombobox({
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    element.value = 'foo'
    input.trigger('input')
    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo', 'bar']])
  })

  it('should add tag with valid search value on blur', async () => {
    const { wrapper } = createMultipleCombobox({})

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'bar'
    input.trigger('input')
    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['bar']])
  })

  it('should be able to add a tag from user input after deleting a tag with delete', async () => {
    const { wrapper } = createMultipleCombobox({
      multiple: true,
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)
    input.trigger('keydown.delete')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo']])
    expect(wrapper.vm.selectedIndex).toBe(0)

    // Must be reset for input to update
    wrapper.vm.selectedIndex = -1
    await wrapper.vm.$nextTick()

    element.value = 'baz'

    input.trigger('input')
    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')[1]).toEqual([['foo', 'baz']])
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  it('should be able to add a tag from user input after clicking a deletable chip', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      clearable: true,
      deletableChips: true,
      multiple: true,
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement
    const chip = wrapper.findAll('.v-chip')[1]
    const close = chip.find('.v-chip__close')

    input.trigger('focus')
    chip.trigger('click')
    close.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo']])
    expect(wrapper.vm.selectedIndex).toBe(-1)

    element.value = 'baz'
    input.trigger('input')
    expect(wrapper.vm.internalSearch).toBe('baz')
    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')[1]).toEqual([['foo', 'baz']])
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  // This test is actually almost useless
  it('should not change search when selecting an index', () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    expect(wrapper.vm.selectedIndex).toBe(-1)

    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)

    expect(wrapper.vm.internalSearch).toBeUndefined()
    input.trigger('keydown.right')
    element.value = 'fizz'
    input.trigger('input')

    expect(wrapper.vm.internalSearch).toBe('fizz')
    expect(wrapper.vm.selectedIndex).toBe(-1)
  })

  // eslint-disable-next-line max-statements
  it('should create new items when a delimiter is entered', async () => {
    const { wrapper } = createMultipleCombobox({
      delimiters: [', ', 'baz'],
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement
    input.trigger('focus')

    element.value = 'foo,'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    element.value += ' '
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo']])
    expect(element.value).toBe('')

    element.value = 'foo,barba'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    element.value += 'z'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')[1]).toEqual([['foo', 'foo,bar']])
    expect(element.value).toBe('')
  })

  it('should allow the editing of an existing value', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      modelValue: ['foo'],
    })

    const chip = wrapper.find('.v-chip')
    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    expect(wrapper.vm.editingIndex).toBe(-1)
    expect(wrapper.vm.internalSearch).toBeUndefined()

    chip.trigger('dblclick')

    expect(wrapper.vm.editingIndex).toBe(0)
    expect(wrapper.vm.internalSearch).toBe('foo')

    element.value = 'foobar'
    input.trigger('input')
    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foobar']])
  })

  it('should paste as item if source of pasted text is item in another v-combobox/v-autocomplete', async () => {
    const { wrapper } = createMultipleCombobox({
      items: ['aaa', 'bbb'],
    })

    const input = wrapper.find('input')
    const getData = jest.fn(mimeType => 'ccc')
    const event = {
      clipboardData: {
        getData,
      },
    }

    input.trigger('focus')
    input.trigger('paste', event)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['ccc']])
  })

  it('should paste as text if source of pasted text is not item in another v-combobox/v-autocomplete', async () => {
    const { wrapper } = createMultipleCombobox({
      items: ['aaa', 'bbb'],
    })

    const input = wrapper.find('input')
    const getData = jest.fn(mimeType => mimeType === 'text/plain' ? 'ccc' : '')
    const event = {
      clipboardData: {
        getData,
      },
    }

    input.trigger('focus')
    input.trigger('paste', event)

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    // expect(input.element.value).toBe('ccc')  // can be checked only in browser environment
  })

  it('should not add search to list when selecting items with keyboard', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      items: ['aaa', 'bbb'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'a'
    input.trigger('input')
    input.trigger('keydown.down')

    await wrapper.vm.$nextTick()

    input.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalSearch).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['aaa']])
  })

  // https://github.com/vuetifyjs/vuetify/issues/12781
  // eslint-disable-next-line max-statements
  it('should correctly add items after deletion and blur', async () => {
    const { wrapper } = createMultipleCombobox({
      multiple: true,
      chips: true,
      modelValue: ['foo', 'bar'],
      items: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    // delete 'bar'
    input.trigger('focus')
    input.trigger('keydown.left')
    expect(wrapper.vm.selectedIndex).toBe(1)
    input.trigger('keydown.delete')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['foo']])
    expect(wrapper.vm.selectedIndex).toBe(0)

    // Lose focus
    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    // Add 'bar' again
    input.trigger('focus')
    element.value = 'bar'
    input.trigger('input')
    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()
    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[1]).toEqual([['foo', 'bar']])

    // Set 'bar' as search input
    element.value = 'bar'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalSearch).toBe('bar')

    // Lose focus
    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue').length).toBeGreaterThanOrEqual(2)
  })

  // https://github.com/vuetifyjs/vuetify/issues/13274
  it('should not add empty values', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      items: ['foo'],
      modelValue: ['foo'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    // Add a value and then remove it
    input.trigger('focus')
    element.value = 'a'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    element.value = ''
    input.trigger('input')
    await wrapper.vm.$nextTick()

    // Lose focus
    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  // https://github.com/vuetifyjs/vuetify/issues/10827
  it('should not add empty chips after clear and re-select', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      clearable: true,
      items: ['foo', 'bar'],
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    // Dbl click chip at index 1
    const chip = wrapper.findAll('.v-chip')[1]
    chip.trigger('dblclick')
    expect(wrapper.vm.editingIndex).toBe(1)
    expect(wrapper.vm.internalSearch).toBe('bar')

    // Click clear button
    const clear = wrapper.find('.v-input__icon--clear .v-icon')
    clear.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([[]])
    await wrapper.vm.$nextTick()

    // Add 'foo'
    input.trigger('focus')
    element.value = 'foo'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')[1]).toEqual([['foo']])
  })

  // https://github.com/vuetifyjs/vuetify/issues/12351
  it('should correctly handle duplicate items', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      items: [
        { text: 'foo', value: 'foo' },
        { text: 'bar', value: 'bar' },
      ],
      modelValue: [
        { text: 'foo', value: 'foo' },
      ],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    element.value = 'foo'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.tab')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  // https://github.com/vuetifyjs/vuetify/issues/6364
  it('should not add duplicate chip after edit', async () => {
    const { wrapper } = createMultipleCombobox({
      chips: true,
      multiple: true,
      clearable: true,
      items: ['foo', 'bar'],
      modelValue: ['foo', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    // Dbl click chip at index 1
    const chip = wrapper.findAll('.v-chip')[1]
    chip.trigger('dblclick')
    expect(wrapper.vm.editingIndex).toBe(1)
    expect(wrapper.vm.internalSearch).toBe('bar')

    // Add a duplicate value - 'foo'
    input.trigger('focus')
    element.value = 'foo'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['bar', 'foo']])
  })

  // example 1 in https://github.com/vuetifyjs/vuetify/issues/14194
  it('should not point to a result that does not exist as in example 1', async () => {
    const { wrapper } = createMultipleCombobox({
      items: ['a', 'aa', 'aaa', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    element.value = 'a'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    element.value = 'aa'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:list-index')
    expect(emitted).toHaveLength(6)
    expect(emitted[0]).toEqual([-1])
    expect(emitted[1]).toEqual([0])
    expect(emitted[2]).toEqual([1])
    expect(emitted[3]).toEqual([2])
    expect(emitted[4]).toEqual([3])
    expect(emitted[5]).toEqual([-1])
  })

  // example 2 in https://github.com/vuetifyjs/vuetify/issues/14194
  it('should not change selection on search input as in example 2', async () => {
    const { wrapper } = createMultipleCombobox({
      items: ['a', 'aa', 'aaa', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    element.value = 'a'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    element.value = 'aa'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:list-index')
    expect(emitted).toHaveLength(5)
    expect(emitted[0]).toEqual([-1])
    expect(emitted[1]).toEqual([0])
    expect(emitted[2]).toEqual([1])
    expect(emitted[3]).toEqual([2])
    expect(emitted[4]).toEqual([1])
  })

  // example 3 in https://github.com/vuetifyjs/vuetify/issues/14194
  it('should not point to a result that does not exist as in example 3', async () => {
    const { wrapper } = createMultipleCombobox({
      items: ['a', 'aa', 'aaa', 'bar'],
    })

    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    element.value = 'a'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()

    element.value = 'aaaa'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:list-index')
    expect(emitted).toHaveLength(3)
    expect(emitted[0]).toEqual([-1])
    expect(emitted[1]).toEqual([0])
    expect(emitted[2]).toEqual([-1])
  })
})

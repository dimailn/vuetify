// Libraries
import { h } from 'vue'

// Components
import VListItem from '../VListItem'
import VListItemGroup from '../VListItemGroup'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VListItemGroup.ts', () => {
  type Instance = InstanceType<typeof VListItemGroup>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VListItemGroup, {
        ...options
      })
    }
  })

  it('should have the correct role', () => {
    const wrapper = mountFunction()

    expect(wrapper.element.getAttribute('role')).toBe('listbox')
  })

  // ui-autocomplete: :model-value="index" из filteredItems при divider между пунктами
  it('should activate items by modelValue when non-list nodes break registration index', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: true,
        modelValue: [4, 5],
      },
      slots: {
        default: () => [
          h(VListItem, { modelValue: 0 }),
          h(VListItem, { modelValue: 1 }),
          h(VListItem, { modelValue: 2 }),
          h('hr', { class: 'v-divider' }),
          h(VListItem, { modelValue: 4 }),
          h(VListItem, { modelValue: 5 }),
        ],
      },
    })

    await wrapper.vm.$nextTick()

    const items = wrapper.findAllComponents({ name: 'v-list-item' })
    expect(items).toHaveLength(5)
    expect(items[3].vm.isActive).toBe(true)
    expect(items[4].vm.isActive).toBe(true)
  })
})

import VTreeviewNode from '../VTreeviewNode'
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h, defineComponent } from 'vue'

// Types
import type { ComponentPublicInstance } from 'vue'

const singleRootTwoChildren = { id: 0, name: 'Root', children: [{ id: 1, name: 'Child' }, { id: 2, name: 'Child 2' }] }

const defaultSlot = () => h('div', 'foobar')

const Mock = defineComponent({
  name: 'test',

  render() {
    return h(VTreeviewNode, {
      slots: {
        prepend: defaultSlot,
        append: defaultSlot,
      },
    })
  },
})

const MockScopedLabel = defineComponent({
  name: 'test',

  render() {
    return h(VTreeviewNode, {
      props: {
        item: singleRootTwoChildren,
      },
      slots: {
        label: (props: any) => h('div', [props.item.name.toUpperCase()]),
      },
    })
  },
})

describe('VTreeViewNode.ts', () => {
  type Instance = InstanceType<typeof VTreeviewNode>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  let treeview

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    treeview = {
      register: jest.fn(),
      unregister: jest.fn(),
      isExcluded: () => false,
      updateActive: () => {},
      emitActive: () => {},
      updateOpen: () => {},
      emitOpen: () => {},
    }

    mountFunction = (options = {}) => {
      return mount(VTreeviewNode, {
        global: {
          mocks: {
            $vuetify: {
              icons: {
                values: {
                  subgroup: 'arrow_drop_down',
                },
              },
            },
          },
          provide: { treeview },
        },
        ...options,
      })
    }
  })

  it('should return indeterminate icon', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.computedIcon).toBe('$checkboxOff')

    // В Vue 3 нужно использовать другой подход для изменения внутренних данных
    wrapper.vm.isIndeterminate = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.computedIcon).toBe('$checkboxIndeterminate')
  })

  it('should use scoped slots', () => {
    const wrapper = mount(Mock, {
      global: {
        provide: { treeview },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should generate a transition element', () => {
    const wrapper = mountFunction({
      props: { transition: true },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should use label slot', () => {
    const wrapper = mount(MockScopedLabel, {
      global: {
        provide: { treeview },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render disabled item', () => {
    const TestComponent = defineComponent({
      name: 'test',

      render() {
        return h(VTreeviewNode, {
          slots: {
            prepend: defaultSlot,
            append: defaultSlot,
          },
          props: {
            item: { ...singleRootTwoChildren, disabled: true },
          },
        })
      },
    })

    const wrapper = mount(TestComponent, {
      global: {
        provide: { treeview },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  const singleRootWithEmptyChildrens = { id: 1, name: 'Child', children: [] }
  it('should be able to have active children with empty array', () => {
    const wrapper = mountFunction({
      props: {
        item: singleRootWithEmptyChildrens,
        activatable: true,
        openOnClick: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(false)
    const selectedLeaf = wrapper.find('.v-treeview-node__root')
    selectedLeaf.trigger('click')
    expect(wrapper.vm.isActive).toBe(true)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not be able to have active children with empty array when loadChildren is specified', () => {
    const wrapper = mountFunction({
      props: {
        item: singleRootWithEmptyChildrens,
        activatable: true,
        openOnClick: true,
        loadChildren: () => {},
      },
    })

    expect(wrapper.vm.isActive).toBe(false)
    const selectedLeaf = wrapper.find('.v-treeview-node__root')
    selectedLeaf.trigger('click')
    expect(wrapper.vm.isActive).toBe(false)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not be able to have active children with empty array when disabled', () => {
    const wrapper = mountFunction({
      props: {
        item: { ...singleRootWithEmptyChildrens, disabled: true },
        activatable: true,
        openOnClick: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(false)
    const selectedLeaf = wrapper.find('.v-treeview-node__root')
    selectedLeaf.trigger('click')
    expect(wrapper.vm.isActive).toBe(false)

    expect(wrapper.html()).toMatchSnapshot()
  })
})

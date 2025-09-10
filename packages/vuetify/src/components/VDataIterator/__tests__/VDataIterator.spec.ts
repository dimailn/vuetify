import { h } from 'vue'
import VDataIterator from '../VDataIterator'
import { Lang } from '../../../services/lang'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { Breakpoint } from '../../../services/breakpoint'
import { preset } from '../../../presets/default'

describe('VDataIterator.ts', () => {
  type Instance = InstanceType<typeof VDataIterator>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  // Включаем автоматическое размонтирование после каждого теста
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', '')

    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VDataIterator, {
        global: {
          mocks: {
            $vuetify: {
              breakpoint: new Breakpoint(preset),
              lang: new Lang(preset),
              theme: {
                dark: false,
              },
              icons: {
                component: null,
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render and match snapshot with data', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          'foo',
          'bar',
          'baz',
          'qux',
        ],
      },
      slots: {
        item (props) {
          return h('div', [props.item])
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render valid no-data, loading and no-results states', async () => {
    const wrapper = mountFunction({
      props: {
        items: [],
        serverItemsLength: 0,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      loading: true,
      items: [],
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      loading: false,
      items: ['foo'],
      search: 'something',
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit when selection happens', async () => {
    const wrapper = mountFunction({
      props: {
        itemKey: 'id',
        items: [
          { id: 1, text: 'foo' },
          { id: 2, text: 'bar' },
        ],
      },
      slots: {
        item: (props: any) => h('div', {
          id: props.item.text,
          onClick: () => props.select(true),
        }, [props.item.text]),
      },
    })

    await wrapper.vm.$nextTick()

    const foo = wrapper.find('#foo')
    expect(foo.exists()).toBe(true)
    await foo.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[{ id: 1, text: 'foo' }]])
  })

  it('should emit when expansion happens', async () => {
    const wrapper = mountFunction({
      props: {
        itemKey: 'id',
        items: [
          { id: 1, text: 'foo' },
          { id: 2, text: 'bar' },
        ],
      },
      slots: {
        item: (props: any) => h('div', {
          id: props.item.text,
          onClick: () => props.expand(true),
        }, [props.item.text]),
      },
    })

    await wrapper.vm.$nextTick()

    const bar = wrapper.find('#bar')
    expect(bar.exists()).toBe(true)
    await bar.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:expanded')).toBeTruthy()
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([[{ id: 2, text: 'bar' }]])
  })

  it('should select all', async () => {
    const items = [
      { id: 'foo' },
      { id: 'bar' },
    ]

    const wrapper = mountFunction({
      props: {
        items,
      },
      slots: {
        header: (props: any) => h('div', {
          id: 'header',
          onClick: () => props.toggleSelectAll(true),
        }),
      },
    })

    await wrapper.vm.$nextTick()

    const header = wrapper.find('#header')
    expect(header.exists()).toBe(true)
    await header.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([items])
    expect(wrapper.emitted('toggle-select-all')).toBeTruthy()
    expect(wrapper.emitted('toggle-select-all')?.[0]).toEqual([{ items, value: true }])
  })

  it('should update expansion from the outside', async () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { id: 'foo' },
          { id: 'bar' },
        ],
      },
    })

    await wrapper.setProps({
      expanded: [{ id: 'foo' }],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:expanded')).toBeTruthy()
    expect(wrapper.emitted('update:expanded')?.slice(-1)[0]).toEqual([[{ id: 'foo' }]])

    await wrapper.setProps({
      expanded: [{ id: 'bar' }],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:expanded')?.slice(-1)[0]).toEqual([[{ id: 'bar' }]])
  })

  it('should update selection from the outside', async () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { id: 'foo' },
          { id: 'bar' },
        ],
      },
    })

    await wrapper.setProps({
      modelValue: [{ id: 'foo' }],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([[{ id: 'foo' }]])

    await wrapper.setProps({
      modelValue: [{ id: 'bar' }],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([[{ id: 'bar' }]])
  })

  it('should check if all items are selected', async () => {
    const render = jest.fn()
    const items = [
      { id: 'foo' }, { id: 'bar' },
    ]

    const wrapper = mountFunction({
      props: {
        items,
      },
      slots: {
        header: render,
      },
    })

    await wrapper.setProps({
      modelValue: items,
    })
    await wrapper.vm.$nextTick()

    expect(render).toHaveBeenLastCalledWith(expect.objectContaining({
      everyItem: true,
      someItems: true,
    }))
  })

  it('should check if some items are selected', async () => {
    const render = jest.fn()
    const items = [
      { id: 'foo' }, { id: 'bar' },
    ]

    const wrapper = mountFunction({
      props: {
        items,
      },
      slots: {
        header: render,
      },
    })

    await wrapper.setProps({
      modelValue: items.slice(1),
    })
    await wrapper.vm.$nextTick()

    expect(render).toHaveBeenLastCalledWith(expect.objectContaining({
      everyItem: false,
      someItems: true,
    }))
  })

  it('should hide footer', () => {
    const wrapper = mountFunction({
      props: {
        hideDefaultFooter: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/8886
  it('should emit page-count event', async () => {
    const wrapper = mountFunction({
      props: {
        items: [
          'foo',
          'bar',
          'baz',
          'qux',
        ],
        itemsPerPage: 1,
      },
    })

    await wrapper.setProps({ itemsPerPage: 4 })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('page-count')).toEqual([[4], [1]])
  })
})

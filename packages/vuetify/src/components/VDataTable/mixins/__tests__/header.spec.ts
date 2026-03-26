import Header from '../header'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'
import { wrapInArray } from '../../../../util/helpers'

describe('VDataTable/header.ts', () => {
  type Instance = InstanceType<typeof Header>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(Header, {
        props: {
          headers: [],
          ...options.props
        },
        render (h) {
          return h('div')
        },
        ...options
      })
    }
  })

  it('should generate sort icon', async () => {
    const wrapper = mountFunction({
      props: {
        sortIcon: 'mdi-sort'
      },
      render () {
        return this.genSortIcon()
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should generate select', async () => {
    const wrapper = mountFunction({
      render () {
        return h('div', wrapInArray(this.genSelectAll()))
      }
    })

    wrapper.setProps({
      everyItem: false,
      someItems: false
    })
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      everyItem: true,
      someItems: false
    })
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      everyItem: false,
      someItems: true
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should generate select scoped slot', async () => {
    const wrapper = mountFunction({
      render () {
        return h('div', wrapInArray(this.genSelectAll()))
      },
      slots: {
        'data-table-select' (props) {
          return h('div', {
            onClick: () => props['onUpdate:modelValue'](true),
            class: 'test'
          }, [JSON.stringify(props)])
        }
      }
    })

    wrapper.setProps({
      everyItem: false,
      someItems: false
    })
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      everyItem: true,
      someItems: false
    })
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      everyItem: false,
      someItems: true
    })
    expect(wrapper.html()).toMatchSnapshot()

    const select = wrapper.find('.test')
    await select.trigger('click')
    expect(wrapper.emitted('toggle-select-all')).toBeTruthy()
    expect(wrapper.emitted('toggle-select-all')![0]).toEqual([true])
  })
})

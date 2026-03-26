import { h } from 'vue'
import VDataFooter from '../VDataFooter'
import { Lang } from '../../../services/lang'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'
import { preset } from '../../../presets/default'

describe('VDataFooter.ts', () => {
  type Instance = InstanceType<typeof VDataFooter>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  // Включаем автоматическое размонтирование после каждого теста
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', '')

    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VDataFooter, {
        global: {
          mocks: {
            $vuetify: {
              icons: {
                component: null
              },
              lang: new Lang(preset),
              theme: {
                dark: false
              }
            }
          }
        },
        ...options
      })
    }
  })

  it('should render with custom itemsPerPage', () => {
    const wrapper = mountFunction({
      props: {
        itemsPerPageOptions: [50, 100],
        options: {
          page: 4,
          itemsPerPage: 100
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100
        }
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render in RTL mode', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100
        },
        showFirstLastPage: true
      },
      global: {
        mocks: {
          $vuetify: {
            rtl: true,
            icons: {
              component: null
            },
            lang: new Lang(preset),
            theme: {
              dark: false
            }
          }
        }
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render first & last icons with showFirstLastPage', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100
        },
        showFirstLastPage: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should switch between pages', () => {
    const mock = jest.fn()

    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100
        },
        'onUpdate:options': mock
      }
    })

    wrapper.vm.onNextPage()
    expect(mock).toHaveBeenCalledWith({ itemsPerPage: 10, page: 5 })
    wrapper.vm.onPreviousPage()
    expect(mock).toHaveBeenCalledWith({ itemsPerPage: 10, page: 3 })
    wrapper.vm.onFirstPage()
    expect(mock).toHaveBeenCalledWith({ itemsPerPage: 10, page: 1 })
    wrapper.vm.onLastPage()
    expect(mock).toHaveBeenCalledWith({ itemsPerPage: 10, page: 10 })
    wrapper.vm.onChangeItemsPerPage(5)
    expect(mock).toHaveBeenCalledWith({ itemsPerPage: 5, page: 1 })
    wrapper.vm.onChangeItemsPerPage(20)
    expect(mock).toHaveBeenCalledWith({ itemsPerPage: 20, page: 1 })
  })

  it('should show current page if has showCurrentPage', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100
        },
        showCurrentPage: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should disable last page button if no items', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 1,
          itemsPerPage: 10
        },
        pagination: {
          page: 1,
          itemsPerPage: 10,
          pageStart: 0,
          pageStop: 0,
          pageCount: 0,
          itemsLength: 0
        },
        showFirstLastPage: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

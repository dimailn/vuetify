// Components
import VSelect from '../VSelect'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'

const statusItems = [{ text: 'Новый', value: 'new' }]

const baseProps = {
  items: statusItems,
  modelValue: 'new',
  placeholder: 'Выберите статус',
  label: ''
}

describe('VSelect placeholder при value', () => {
  type Instance = InstanceType<typeof VSelect>
  let mountFunction: (options?: object) => VueWrapper<Instance>
  let el: HTMLDivElement

  beforeEach(() => {
    mountFunction = (options = {}) => {
      el = document.createElement('div')
      el.setAttribute('data-app', 'true')
      document.body.appendChild(el)

      return mount(VSelect, {
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
                component: 'mdi'
              }
            }
          }
        },
        attachTo: el,
        ...options
      })
    }
  })

  afterEach(() => {
    if (el?.parentNode) {
      document.body.removeChild(el)
    }
  })

  enableAutoUnmount(afterEach)

  function textInput (wrapper: VueWrapper<Instance>) {
    return wrapper.find('input[type="text"]')
  }

  it('при value: isDirty и текст выбора корректны', () => {
    const wrapper = mountFunction({ props: baseProps })

    expect(wrapper.vm.isDirty).toBe(true)
    expect(wrapper.find('.v-select__selection--comma').text()).toBe('Новый')
  })

  it('при value: на text-input нет атрибута placeholder', () => {
    const wrapper = mountFunction({ props: baseProps })
    const input = textInput(wrapper)

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBeUndefined()
  })

  it('при пустом value: placeholder на text-input есть', () => {
    const wrapper = mountFunction({
      props: {
        ...baseProps,
        modelValue: null
      }
    })
    const input = textInput(wrapper)

    expect(wrapper.vm.isDirty).toBe(false)
    expect(input.attributes('placeholder')).toBe('Выберите статус')
  })

  it('со слотом #selection при value: placeholder на input отсутствует', () => {
    const wrapper = mountFunction({
      props: baseProps,
      slots: {
        selection: ({ item }: { item: { text: string } }) => h('span', item.text)
      }
    })
    const input = textInput(wrapper)

    expect(wrapper.text()).toContain('Новый')
    expect(input.attributes('placeholder')).toBeUndefined()
  })

  it('при persistentPlaceholder и value: placeholder на input отсутствует', () => {
    const wrapper = mountFunction({
      props: {
        ...baseProps,
        persistentPlaceholder: true
      }
    })
    const input = textInput(wrapper)

    expect(input.attributes('placeholder')).toBeUndefined()
  })
})

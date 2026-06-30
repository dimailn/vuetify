import { mount } from '@vue/test-utils'
import VMenu from '../VMenu'
import { h } from 'vue'

describe('activator test', () => {
  it('passes onClick to the slot', async () => {
    const el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)

    const wrapper = mount(VMenu, {
      props: {
        attach: true
      },
      slots: {
        activator: (props: any) => h('button', { class: 'activator', ...props.attrs }, 'Activator'),
        default: () => h('div', 'Content')
      }
    })

    const btn = wrapper.find('.activator')
    await btn.trigger('click')
    console.log('isActive:', (wrapper.vm as any).isActive)
  })
})

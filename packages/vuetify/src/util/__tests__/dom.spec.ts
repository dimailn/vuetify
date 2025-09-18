import { defineComponent, h } from 'vue'
import {
  mount,
  enableAutoUnmount,
} from '@vue/test-utils'
import {
  attachedRoot,
} from '../dom'

const FooComponent = defineComponent({
  render () {
    return h('div', ['foo'])
  },
})

describe('dom', () => {
  enableAutoUnmount(afterEach)

  it('should properly detect an element\'s root', () => {
    const shadowHost = document.createElement('div')
    expect(attachedRoot(shadowHost)).toBeNull()

    const shadowRoot = shadowHost.attachShadow({ mode: 'closed' })
    expect(attachedRoot(shadowRoot)).toBeNull()

    document.body.appendChild(shadowHost)
    expect(attachedRoot(shadowHost)).toBe(document)

    expect(attachedRoot(shadowRoot)).toBe(shadowRoot)

    const insideDiv = document.createElement('div')
    expect(attachedRoot(insideDiv)).toBeNull()

    shadowRoot.appendChild(insideDiv)
    expect(attachedRoot(insideDiv)).toBe(shadowRoot)
  })

  it('should detect the root of mounted components', () => {
    const attachedWrapper = mount(FooComponent, { attachTo: document.body })
    expect(attachedRoot(attachedWrapper.element)).toBe(document)

    const detachedWrapper = mount(FooComponent)
    expect(attachedRoot(detachedWrapper.element)).toBeNull()
  })
})

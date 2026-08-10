import { defineComponent, h, Comment, Fragment } from 'vue'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import VMenu from '../VMenu'
import VTextField from '../../VTextField/VTextField'

enableAutoUnmount(afterEach)

function mergeActivator ({ attrs, on }: { attrs: Record<string, unknown>, on: Record<string, Function> }) {
  return { ...attrs, ...on }
}

/**
 * Имитация compiled renderSlot с fallback (UiDropdown #activator).
 * Comment-only custom slot → key `_activator_fb`, после выбора → `_activator`.
 */
function renderActivatorSlot (
  props: { attrs: Record<string, unknown>, on: Record<string, Function> },
  selected: string | null,
  captureSpy?: jest.Mock
) {
  const customSlot = selected
    ? h('button', {
      type: 'button',
      class: 'selected-activator',
      ...mergeActivator(props),
      ...(captureSpy ? { onClickCapture: captureSpy } : {})
    }, selected)
    : h(Comment)

  const fallback = h('button', {
    type: 'button',
    class: 'fallback-activator',
    ...mergeActivator(props)
  }, 'Open')

  const validContent = selected ? customSlot : null
  const content = validContent || fallback
  const key = selected ? '_activator' : '_activator_fb'

  return h(Fragment, { key }, [content])
}

function createFallbackSwapHarness (attach?: boolean) {
  return defineComponent({
    name: attach ? 'FallbackSwapHarness' : 'DefaultAttachFallbackSwapHarness',
    components: { VMenu },
    data: () => ({
      selected: null as string | null,
      captureCount: 0
    }),
    methods: {
      onCapture () {
        this.captureCount += 1
      }
    },
    render () {
      return h(VMenu, {
        modelValue: false,
        closeOnContentClick: true,
        ...(attach ? { attach: true } : {}),
        'onUpdate:modelValue': () => {}
      }, {
        activator: (props: { attrs: Record<string, unknown>, on: Record<string, Function> }) =>
          renderActivatorSlot(props, this.selected, this.onCapture),
        default: () => h('div', {
          class: 'menu-item',
          onClick: () => {
            this.selected = 'a'
          }
        }, 'Option A')
      })
    }
  })
}

const FallbackSwapHarness = createFallbackSwapHarness(true)
const DefaultAttachFallbackSwapHarness = createFallbackSwapHarness()

const TypeSwapHarness = defineComponent({
  name: 'TypeSwapHarness',
  components: { VMenu },
  data: () => ({ selected: null as string | null }),
  render () {
    return h(VMenu, {
      modelValue: false,
      closeOnContentClick: true,
      'onUpdate:modelValue': () => {}
    }, {
      activator: (props: { attrs: Record<string, unknown>, on: Record<string, Function> }) => (
        this.selected
          ? h('button', {
            type: 'button',
            class: 'selected-activator',
            ...mergeActivator(props)
          }, this.selected)
          : h('span', {
            class: 'fallback-activator',
            ...mergeActivator(props)
          }, 'Open')
      ),
      default: () => h('div', {
        class: 'menu-item',
        onClick: () => {
          this.selected = 'a'
        }
      }, 'Option A')
    })
  }
})

const VIfSwapHarness = defineComponent({
  name: 'VIfSwapHarness',
  components: { VMenu },
  data: () => ({ selected: null as string | null }),
  render () {
    return h(VMenu, {
      modelValue: false,
      closeOnContentClick: true,
      attach: true,
      'onUpdate:modelValue': () => {}
    }, {
      activator: (props: { attrs: Record<string, unknown>, on: Record<string, Function> }) => (
        this.selected
          ? h('button', {
            type: 'button',
            class: 'selected-activator',
            ...mergeActivator(props)
          }, this.selected)
          : h('button', {
            type: 'button',
            class: 'default-activator',
            ...mergeActivator(props)
          }, 'Open')
      ),
      default: () => h('div', {
        class: 'menu-item',
        onClick: () => {
          this.selected = 'a'
        }
      }, 'Option A')
    })
  }
})

const TextFieldAppendMenuHarness = defineComponent({
  name: 'TextFieldAppendMenuHarness',
  components: { VMenu, VTextField },
  render () {
    return h(VTextField, {}, {
      append: () => [
        h(Comment, 'append-leading-comment'),
        h(VMenu, {
          modelValue: false,
          'onUpdate:modelValue': () => {}
        }, {
          activator: (props: { attrs: Record<string, unknown>, on: Record<string, Function> }) =>
            h('button', {
              type: 'button',
              class: 'append-activator',
              ...mergeActivator(props)
            }, 'Open'),
          default: () => h('div', 'Content')
        })
      ]
    })
  }
})

const TextFieldAppendMenuWithPrecedingElementHarness = defineComponent({
  name: 'TextFieldAppendMenuWithPrecedingElementHarness',
  components: { VMenu, VTextField },
  render () {
    return h(VTextField, {}, {
      append: () => [
        h('span', { class: 'append-preceding-element' }, 'Prefix'),
        h(VMenu, {
          modelValue: false,
          'onUpdate:modelValue': () => {}
        }, {
          activator: (props: { attrs: Record<string, unknown>, on: Record<string, Function> }) =>
            h('button', {
              type: 'button',
              class: 'append-activator',
              ...mergeActivator(props)
            }, 'Open'),
          default: () => h('div', 'Content')
        })
      ]
    })
  }
})

async function flushMenu () {
  await Promise.resolve()
  await new Promise(resolve => setTimeout(resolve, 0))
}

function getVMenuEl () {
  return document.querySelector('.v-menu') as HTMLElement | null
}

function assertActivatorSibling (activator: HTMLElement) {
  const vMenu = getVMenuEl()
  expect(vMenu).toBeTruthy()
  expect(activator.parentElement).toBe(vMenu!.parentElement)
  expect(activator.nextElementSibling === vMenu || activator.previousElementSibling === vMenu).toBe(true)
}

function assertActivatorOutsideHiddenMenu (activator: HTMLElement) {
  const vMenu = getVMenuEl()
  expect(vMenu).toBeTruthy()
  expect(vMenu!.classList.contains('v-menu--attached')).toBe(false)
  expect(vMenu!.contains(activator)).toBe(false)
  assertActivatorSibling(activator)
}

async function swapActivatorViaMenuItem (wrapper: ReturnType<typeof mount>) {
  const menuItem = document.querySelector('.menu-item') as HTMLElement
  expect(menuItem).toBeTruthy()
  menuItem.click()
  await flushMenu()
  await wrapper.vm.$nextTick()
}

describe('VMenu activator swap', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div data-app="true"></div>'

    const style = document.createElement('style')
    style.id = 'vmenu-regression-styles'
    style.textContent = '.v-menu:not(.v-menu--attached) { display: none !important; }'
    document.head.appendChild(style)
  })

  afterEach(() => {
    document.getElementById('vmenu-regression-styles')?.remove()
  })

  it('passes onClick to the slot activator', async () => {
    const wrapper = mount(VMenu, {
      attachTo: document.body,
      props: {
        attach: true
      },
      slots: {
        activator: (props: { attrs: Record<string, unknown>, on: Record<string, Function> }) =>
          h('button', { class: 'activator', ...mergeActivator(props) }, 'Activator'),
        default: () => h('div', 'Content')
      }
    })

    await wrapper.find('.activator').trigger('click')
    expect((wrapper.vm as any).isActive).toBe(true)
  })

  it('hoists append activator before v-menu with comment nodes', async () => {
    const wrapper = mount(TextFieldAppendMenuHarness, {
      attachTo: document.body
    })

    await flushMenu()

    const appendInner = wrapper.find('.v-input__append-inner')
    const children = Array.from(appendInner.element.children)

    expect(children.map(child => child.className)).toEqual(['append-activator', 'v-menu'])
    expect(appendInner.html()).toMatchSnapshot()

    await appendInner.find('.append-activator').trigger('click')
    await flushMenu()

    expect(Array.from(appendInner.element.children).map(child => child.className))
      .toEqual(['append-activator', 'v-menu'])
    expect(appendInner.html()).toMatchSnapshot('after opening menu')
  })

  it('hoists activator before v-menu with a preceding element', async () => {
    const wrapper = mount(TextFieldAppendMenuWithPrecedingElementHarness, {
      attachTo: document.body
    })

    await flushMenu()

    const appendInner = wrapper.find('.v-input__append-inner')
    const children = Array.from(appendInner.element.children)

    expect(children.map(child => child.className))
      .toEqual(['append-preceding-element', 'append-activator', 'v-menu'])
  })

  it('replaces fallback activator after selection without stale DOM (TEM-15225)', async () => {
    const wrapper = mount(FallbackSwapHarness, {
      attachTo: document.body
    })

    await flushMenu()

    const fallback = document.querySelector('.fallback-activator') as HTMLElement
    expect(fallback).toBeTruthy()
    expect(fallback.isConnected).toBe(true)
    assertActivatorSibling(fallback)

    fallback.click()
    await flushMenu()
    expect((wrapper.findComponent(VMenu).vm as any).isActive).toBe(true)

    const menuItem = document.querySelector('.menu-item') as HTMLElement
    expect(menuItem).toBeTruthy()
    menuItem.click()
    await flushMenu()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selected).toBe('a')
    expect(document.querySelector('.fallback-activator')).toBeNull()
    expect(document.querySelectorAll('button')).toHaveLength(1)

    const selected = document.querySelector('.selected-activator') as HTMLElement
    expect(selected).toBeTruthy()
    expect(selected.isConnected).toBe(true)
    assertActivatorSibling(selected)
    expect(wrapper.vm.captureCount).toBe(0)

    selected.click()
    await flushMenu()
    expect(wrapper.vm.captureCount).toBe(1)
    expect((wrapper.findComponent(VMenu).vm as any).isActive).toBe(true)
  })

  it('keeps swapped activator outside hidden .v-menu with default attach (TEM-15225)', async () => {
    const wrapper = mount(DefaultAttachFallbackSwapHarness, {
      attachTo: document.body
    })

    await flushMenu()

    const fallback = document.querySelector('.fallback-activator') as HTMLElement
    expect(fallback).toBeTruthy()
    assertActivatorOutsideHiddenMenu(fallback)

    fallback.click()
    await flushMenu()
    expect((wrapper.findComponent(VMenu).vm as any).isActive).toBe(true)

    await swapActivatorViaMenuItem(wrapper)

    expect(wrapper.vm.selected).toBe('a')
    expect(document.querySelector('.fallback-activator')).toBeNull()
    expect(document.querySelectorAll('button')).toHaveLength(1)

    const selected = document.querySelector('.selected-activator') as HTMLElement
    expect(selected).toBeTruthy()
    expect(selected.isConnected).toBe(true)
    assertActivatorOutsideHiddenMenu(selected)

    const menuVm = wrapper.findComponent(VMenu).vm as any
    expect(menuVm.getActivator()).toBe(selected)
    expect(wrapper.vm.captureCount).toBe(0)

    selected.click()
    await flushMenu()
    expect(wrapper.vm.captureCount).toBe(1)
    expect(menuVm.isActive).toBe(true)
  })

  it('reopens menu after activator type swap with default attach', async () => {
    const wrapper = mount(TypeSwapHarness, {
      attachTo: document.body
    })

    await flushMenu()

    const fallback = document.querySelector('.fallback-activator') as HTMLElement
    expect(fallback).toBeTruthy()
    assertActivatorOutsideHiddenMenu(fallback)

    fallback.click()
    await flushMenu()
    expect((wrapper.findComponent(VMenu).vm as any).isActive).toBe(true)

    await swapActivatorViaMenuItem(wrapper)

    expect(document.querySelector('.fallback-activator')).toBeNull()

    const selected = document.querySelector('.selected-activator') as HTMLElement
    expect(selected).toBeTruthy()
    expect(selected.isConnected).toBe(true)
    assertActivatorOutsideHiddenMenu(selected)

    const menuVm = wrapper.findComponent(VMenu).vm as any
    expect(menuVm.getActivator()).toBe(selected)

    selected.click()
    await flushMenu()
    expect(menuVm.isActive).toBe(true)
  })

  it('reopens menu after v-if activator swap', async () => {
    const wrapper = mount(VIfSwapHarness, {
      attachTo: document.body
    })

    await flushMenu()

    const defaultBtn = document.querySelector('.default-activator') as HTMLElement
    defaultBtn.click()
    await flushMenu()
    expect((wrapper.findComponent(VMenu).vm as any).isActive).toBe(true)

    const menuItem = document.querySelector('.menu-item') as HTMLElement
    menuItem.click()
    await flushMenu()
    await wrapper.vm.$nextTick()

    const selected = document.querySelector('.selected-activator') as HTMLElement
    expect(selected).toBeTruthy()
    expect(selected.isConnected).toBe(true)
    assertActivatorSibling(selected)

    selected.click()
    await flushMenu()
    expect((wrapper.findComponent(VMenu).vm as any).isActive).toBe(true)
  })
})

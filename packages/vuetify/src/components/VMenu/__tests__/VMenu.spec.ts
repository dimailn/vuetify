// Components
import VMenu from '../VMenu'
import VCard from '../../VCard/VCard'
import VListItem from '../../VList/VListItem'

// Utilities
import {
  mount,
  enableAutoUnmount,
  VueWrapper,
} from '@vue/test-utils'
import { h } from 'vue'
import { keyCodes } from '../../../util/helpers'
import { waitAnimationFrame } from '../../../../test'

// Auto cleanup after each test
enableAutoUnmount(afterEach)

describe('VMenu.ts', () => {
  type Instance = InstanceType<typeof VMenu>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VMenu, {
        // https://github.com/vuejs/vue-test-utils/issues/1130
        sync: false,
        ...options,
        global: {
          mocks: {
            $vuetify: {
              theme: {},
            },
          },
          ...options.global,
        },
      })
    }
  })

  it('should work', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
        eager: true,
      },
      slots: {
        activator: ({ on }) => h('button', { onClick: on.click }),
        default: () => h(VCard),
      },
    })

    const activator = wrapper.find('button')
    activator.trigger('click')

    await wrapper.vm.$nextTick()

    // Manually set isActive for testing
    wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()

    // VMenu doesn't emit update:modelValue, it uses isActive internally
    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render multiple content nodes', async () => {
    const wrapper = mountFunction({
      props: {
        eager: true,
      },
      slots: {
        activator: ({ on }) => h('button', { onClick: on.click }),
        default: () => [h('span', 'foo'), h('span', 'bar')],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should round dimensions', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
        eager: true,
      },
      slots: {
        activator: ({ on }) => h('button', { onClick: on.click }),
        default: () => h('span', { class: 'content' }),
      },
    })

    const content = wrapper.find('.v-menu__content')

    const getBoundingClientRect = () => {
      return {
        width: 100.5,
        height: 100.25,
        top: 0.75,
        left: 50.123,
        right: 75.987,
        bottom: 4,
        x: 0,
        y: 0,
      }
    }

    wrapper.find('button').element.getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$refs.content.getBoundingClientRect = getBoundingClientRect

    await wrapper.setProps({ modelValue: true })

    await waitAnimationFrame()

    expect(content.attributes('style')).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should not attach event handlers to the activator container if disabled', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
      slots: {
        activator: ({ on }) => h('button', { onClick: on.click }),
      },
    })

    const activator = wrapper.find('button')
    activator.trigger('click')

    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should show the menu on mounted', () => {
    const wrapper1 = mountFunction({})

    expect(wrapper1.vm.isActive).toBe(false)

    const wrapper2 = mountFunction({
      props: { modelValue: true },
    })
    expect(wrapper2.vm.isActive).toBe(true)
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should update position dynamically', async () => {
    const wrapper = mountFunction({
      props: {
        absolute: true,
        modelValue: true,
        positionX: 100,
        positionY: 200,
      },
    })

    const content = wrapper.findAll('.v-menu__content').at(0)

    // TODO replace with jest fakeTimers when it will support requestAnimationFrame: https://github.com/facebook/jest/pull/7776
    // See https://github.com/vuetifyjs/vuetify/pull/6330#issuecomment-460083547 for details
    expect(content.attributes('style')).toMatchSnapshot()

    await wrapper.setProps({
      positionX: 110,
      positionY: 220,
    })
    expect(content.attributes('style')).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should select next and previous tiles and skip non links/disabled', () => {
    const wrapper = mountFunction({
      props: { eager: true },
      slots: {
        default () {
          return h('div', [
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
            h(VListItem),
            h(VListItem, { link: true }),
          ])
        },
      },
    })

    wrapper.vm.getTiles()

    expect(wrapper.vm.listIndex).toBe(-1)

    wrapper.vm.nextTile()
    expect(wrapper.vm.listIndex).toBe(0)

    wrapper.vm.nextTile()
    expect(wrapper.vm.listIndex).toBe(1)

    wrapper.vm.nextTile()
    expect(wrapper.vm.listIndex).toBe(3)

    wrapper.vm.nextTile()
    expect(wrapper.vm.listIndex).toBe(0)

    wrapper.vm.prevTile()
    expect(wrapper.vm.listIndex).toBe(3)

    wrapper.vm.prevTile()
    expect(wrapper.vm.listIndex).toBe(1)

    wrapper.vm.prevTile()
    expect(wrapper.vm.listIndex).toBe(0)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should accept a custom role or use default', () => {
    expect(mountFunction({
      props: { eager: true },
    }).vm.$refs.content.getAttribute('role')).toBe('menu')
    expect(mountFunction({
      props: { eager: true },
      attrs: { role: 'listbox' },
    }).vm.$refs.content.getAttribute('role')).toBe('listbox')

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should select first or last item when opening menu with up or down key', async () => {
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: { eager: true },
      slots: {
        default () {
          return h('div', [
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
          ])
        },
      },
    })

    wrapper.vm.onKeyDown(event(keyCodes.up))
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listIndex).toBe(3)

    wrapper.setData({ isActive: false })

    wrapper.vm.onKeyDown(event(keyCodes.down))
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listIndex).toBe(0)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should be able to navigate the menu list with up and down keys', async () => {
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: { eager: true },
      slots: {
        default () {
          return h('div', [
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
          ])
        },
      },
    })

    wrapper.setData({ isActive: true })

    wrapper.vm.onKeyDown(event(keyCodes.down))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listIndex).toBe(0)

    wrapper.vm.onKeyDown(event(keyCodes.up))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listIndex).toBe(1)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should select first or last item when pressing home or end on active menu', async () => {
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: { eager: true },
      slots: {
        default () {
          return h('div', [
            h(VListItem),
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
            h(VListItem, { link: true }),
          ])
        },
      },
    })

    wrapper.setData({ isActive: true })

    wrapper.vm.onKeyDown(event(keyCodes.end))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listIndex).toBe(3)

    wrapper.vm.onKeyDown(event(keyCodes.home))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listIndex).toBe(1)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should deactivate when escape is pressed', async () => {
    jest.useFakeTimers()
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: { eager: true },
    })

    wrapper.setData({ isActive: true })

    wrapper.vm.onKeyDown(event(keyCodes.esc))

    await wrapper.vm.$nextTick()
    jest.runAllTimers()

    expect(wrapper.vm.isActive).toBe(false)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
    jest.useRealTimers()
  })

  it('should disable escape key when disableKeys is true', async () => {
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: {
        eager: true,
        disableKeys: true,
      },
    })

    wrapper.setData({ isActive: true })

    wrapper.vm.onKeyDown(event(keyCodes.esc))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should disable navigation keys when disableKeys is true', async () => {
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: {
        eager: true,
        disableKeys: true,
      },
      slots: {
        default () {
          return h('div', [
            h(VListItem, { link: true }),
          ])
        },
      },
    })

    wrapper.setData({ isActive: true })

    wrapper.vm.onKeyDown(event(keyCodes.up))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listIndex).toBe(-1)

    wrapper.vm.onKeyDown(event(keyCodes.down))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listIndex).toBe(-1)

    wrapper.vm.onKeyDown(event(keyCodes.end))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listIndex).toBe(-1)

    wrapper.vm.onKeyDown(event(keyCodes.home))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listIndex).toBe(-1)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should not open menu on up or down press when disableKeys is true', async () => {
    const event = (keyCode: number) => new KeyboardEvent('keydown', { keyCode })
    const wrapper = mountFunction({
      props: {
        eager: true,
        disableKeys: true,
      },
    })

    wrapper.vm.onKeyDown(event(keyCodes.up))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.listIndex).toBe(-1)

    wrapper.vm.onKeyDown(event(keyCodes.down))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.listIndex).toBe(-1)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should call onScroll prop when provided', async () => {
    const onScrollSpy = jest.fn()
    const wrapper = mountFunction({
      props: {
        onScroll: onScrollSpy,
        eager: true,
      },
      slots: {
        activator: ({ on }) => h('button', { onClick: on.click }),
        default: () => h(VCard),
      },
    })

    const content = wrapper.find('.v-menu__content')
    content.trigger('scroll')

    expect(onScrollSpy).toHaveBeenCalled()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })
})

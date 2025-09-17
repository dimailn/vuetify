// Components
import VSlideGroup, { calculateCenteredOffset, calculateUpdatedOffset } from '../VSlideGroup'

// Services
import { Breakpoint } from '../../../services/breakpoint'
import { preset } from '../../../presets/default'

// Utilities
import { ExtractVue } from '../../../util/mixins'
import {
  shallowMount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VSlideGroup.ts', () => {
  type Instance = ExtractVue<typeof VSlideGroup>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return shallowMount(VSlideGroup, {
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              breakpoint: new Breakpoint(preset),
            },
          },
        },
        ...options,
      })
    }
  })

  it('should conditionally have affixes, prev and next', () => {
    const wrapper = mountFunction({
      data: () => ({
        isOverflowing: true,
      }),
      props: {
        showArrows: true,
      },
    })

    expect(wrapper.vm.hasAffixes).toBe(true)
    expect(wrapper.vm.hasNext).toBe(false)
    expect(wrapper.vm.hasPrev).toBe(false)

    wrapper.vm.scrollOffset = 100
    wrapper.vm.widths = {
      content: 1000,
      wrapper: 500,
    }

    expect(wrapper.vm.hasPrev).toBe(true)

    wrapper.vm.scrollOffset = -100
    wrapper.vm.widths = {
      content: 1000,
      wrapper: 500,
    }

    expect(wrapper.vm.hasNext).toBe(true)
  })

  it('should compute newOffset for active element', async () => {
    const { calculateNewOffset } = mountFunction().vm
    let currentOffset = 0
    const testOffsetAndUpdate = (direction: 'prev' | 'next', rtl: boolean, expectedOffset: number) => {
      currentOffset = calculateNewOffset(direction, {
        content: 1000,
        wrapper: 400,
      }, rtl, currentOffset)

      expect(currentOffset).toBe(expectedOffset)
    }

    testOffsetAndUpdate('next', false, 400)
    testOffsetAndUpdate('next', false, 600)
    testOffsetAndUpdate('next', false, 600)
    testOffsetAndUpdate('prev', false, 200)
    testOffsetAndUpdate('prev', false, 0)
    testOffsetAndUpdate('prev', false, 0)
    // RTL
    currentOffset = 0
    testOffsetAndUpdate('next', true, -400)
    testOffsetAndUpdate('next', true, -600)
    testOffsetAndUpdate('next', true, -600)
    testOffsetAndUpdate('prev', true, -200)
    testOffsetAndUpdate('prev', true, -0)
    testOffsetAndUpdate('prev', true, -0)
  })

  it('should compute updatedOffset for active element', async () => {
    const testOffset = (offsetLeft: number, rtl: boolean, expectedOffset: number) => {
      const offset = calculateUpdatedOffset({
        offsetLeft,
        clientWidth: 20,
      } as HTMLElement, {
        content: 1000,
        wrapper: 500,
      }, rtl, 0)

      expect(offset).toBe(expectedOffset)
    }

    testOffset(10, false, 0)
    testOffset(400, false, 0)
    testOffset(600, false, 128)
    testOffset(960, false, 488)
    // RTL
    testOffset(10, true, -498)
    testOffset(400, true, -108)
    testOffset(600, true, 0)
    testOffset(960, true, 0)
  })

  it('should compute centeredOffset for active element', async () => {
    const testOffset = (offsetLeft: number, rtl: boolean, expectedOffset: number) => {
      const offset = calculateCenteredOffset({
        offsetLeft,
        clientWidth: 20,
      } as HTMLElement, {
        content: 1000,
        wrapper: 500,
      }, rtl)

      expect(offset).toBe(expectedOffset)
    }

    testOffset(10, false, 0)
    testOffset(400, false, 160)
    testOffset(600, false, 360)
    testOffset(960, false, 500)
    // RTL
    testOffset(10, true, -500)
    testOffset(400, true, -340)
    testOffset(600, true, -140)
    testOffset(960, true, -0)
  })

  // TODO: Unsure what we're actually testing, willChange not found in jest 24
  it.skip('should call on touch methods', async () => {
    const wrapper = mountFunction({
      data: () => ({
        isOverflowing: true,
      }),
    })

    expect(wrapper.vm.scrollOffset).toBe(0)

    const touchstartEvent = {
      touchstartX: 10,
      touchmoveX: 0,
    }

    wrapper.vm.onTouchStart(touchstartEvent)

    expect(wrapper.vm.startX).toBe(10)
    expect(wrapper.vm.$refs.content.style.transition).toBe('none')
    expect(wrapper.vm.$refs.content.style.willChange).toBe('transform')

    const touchmoveEvent = {
      touchstartX: 10,
      touchmoveX: 100,
    }
    wrapper.vm.onTouchMove(touchmoveEvent)

    expect(wrapper.vm.scrollOffset).toBe(-90)

    wrapper.vm.onTouchEnd()

    expect(wrapper.vm.scrollOffset).toBe(0)

    wrapper.vm.scrollOffset = 90
    wrapper.vm.isOverflowing = true

    wrapper.vm.onTouchEnd()
    expect(wrapper.vm.scrollOffset).toBe(0)

    // TODO: Figure out why this doesn't work in TS + vue-test-utils
    // groupWrapper.trigger('touchmove')
    // touch(groupWrapper).start(0, 0)
    // touch(groupWrapper).end(0, 0)
    // touch(groupWrapper).move(15, 15)
    // expect(onTouch.mock.calls.length).toBe(3)
  })

  it('should invoke method only if overflowing', () => {
    const wrapper = mountFunction()
    const fn = jest.fn()
    const event = {
      touchstartX: 0,
      touchmoveX: 0,
      stopPropagation: () => {},
    }

    wrapper.vm.overflowCheck(event, fn)
    expect(fn).not.toHaveBeenCalled()

    wrapper.vm.isOverflowing = true
    wrapper.vm.overflowCheck(event, fn)
    expect(fn).toHaveBeenCalled()
  })

  it('should scroll from affix click', async () => {
    const onClick = jest.fn()
    const scrollTo = jest.fn()
    const setWidths = jest.fn()
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            breakpoint: new Breakpoint(preset),
          },
        },
      },
      props: {
        showArrows: true,
      },
      attrs: {
        'onClick:prev': onClick,
        'onClick:next': onClick,
      },
    })

    // Mock the methods
    wrapper.vm.scrollTo = scrollTo
    wrapper.vm.setWidths = setWidths

    wrapper.vm.isOverflowing = true
    wrapper.vm.scrollOffset = 200
    wrapper.vm.widths = {
      content: 1000,
      wrapper: 500,
    }

    await wrapper.vm.$nextTick()

    const prev = wrapper.find('.v-slide-group__prev')
    const next = wrapper.find('.v-slide-group__next')

    prev.trigger('click')
    next.trigger('click')
    expect(scrollTo).toHaveBeenCalledTimes(2)
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('should accept scoped slots', () => {
    const wrapper = mountFunction({
      computed: {
        hasAffixes: () => true,
        hasNext: () => true,
        hasPrev: () => true,
      },
      props: {
        showArrows: true,
      },
      slots: {
        prev () {
          return h('div', {
            class: 'fizz',
          }, 'foo')
        },
        next () {
          return h('div', {
            class: 'fizz',
          }, 'bar')
        },
      },
    })

    wrapper.vm.isOverflowing = true

    expect(wrapper.findAll('.fizz')).toHaveLength(2)
  })

  it('should match snapshot in rtl', async () => {
    const wrapper = mountFunction({
      props: {
        showArrows: true,
      },
      global: {
        mocks: {
          $vuetify: {
            rtl: true,
            breakpoint: { mobileBreakpoint: 1264 },
          },
        },
      },
    })

    // Set up data to show affixes
    wrapper.vm.isOverflowing = true
    wrapper.vm.scrollOffset = 200
    wrapper.vm.widths = {
      content: 1000,
      wrapper: 500,
    }

    const html1 = wrapper.html()

    expect(html1).toMatchSnapshot()
  })

  // showArrows | isOverflowing | isMobile | hasAffixes
  it.each([
    [true, true, true, true],
    [true, true, false, true],
    [true, false, true, false],
    [true, false, false, false],
    ['desktop', true, false, true],
    ['desktop', true, true, false],
    ['desktop', false, false, true],
    ['desktop', false, true, false],
    ['always', true, true, true],
    ['always', true, false, true],
    ['always', false, false, true],
  ])('should conditionally show arrows with %s %s %s %s', (...opts) => {
    const [
      showArrows,
      isOverflowing,
      isMobile,
      hasAffixes,
    ] = opts

    const wrapper = mountFunction({
      data: () => ({ isOverflowing }),
      computed: { isMobile: () => isMobile },
      props: { showArrows },
    })

    expect(wrapper.vm.hasAffixes).toBe(hasAffixes)
  })

  it('should has affixes on desktop when scrollOffset greater than 0', async () => {
    const wrapper = mountFunction({
      data: () => ({
        scrollOffset: 200,
      }),
      computed: { isMobile: () => false },
    })

    expect(wrapper.vm.hasAffixes).toBe(true)

    await wrapper.setProps({ showArrows: true })
    expect(wrapper.vm.hasAffixes).toBe(true)

    await wrapper.setProps({ showArrows: 'mobile' })
    expect(wrapper.vm.hasAffixes).toBe(true)
  })

  it('should calculateNewOffset when call scrollIntoView and last item position is not into view', () => {
    const calculateNewOffset = jest.fn()

    const wrapper = mountFunction({
      data: () => ({
        items: [{ $el: {} }],
      }),
    })

    // Mock the method
    wrapper.vm.calculateNewOffset = calculateNewOffset

    const setWrapperPosition = ({ left = 0, right = 0 } = {}) => {
      wrapper.vm.$refs.wrapper.getBoundingClientRect = () => ({ left, right } as DOMRectReadOnly)
    }

    const setLastItemPosition = ({ left = 0, right = 0 } = {}) => {
      wrapper.vm.items[wrapper.vm.items.length - 1].$el.getBoundingClientRect = () => ({ left, right } as DOMRectReadOnly)
    }

    setWrapperPosition({ left: 100 })
    setLastItemPosition({ left: 50 })

    wrapper.vm.scrollIntoView()

    expect(calculateNewOffset).toHaveBeenCalledTimes(1)

    calculateNewOffset.mockClear()

    // RTL

    wrapper.vm.$vuetify.rtl = true

    setWrapperPosition({ right: 50 })
    setLastItemPosition({ right: 100 })

    wrapper.vm.scrollIntoView()

    expect(calculateNewOffset).toHaveBeenCalledTimes(1)
  })
})

import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import VCarouselItem from '../VCarouselItem'

const imageSrc = 'https://v2.vuetifyjs.com/static/doc-images/cards/sunshine.jpg'
const warning = '[Vuetify] The v-window-item component must be used inside a v-window'

describe('VCarouselItem.ts', () => {
  type Instance = InstanceType<typeof VCarouselItem>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VCarouselItem, options)
    }
  })

  it('should throw warning when not used inside v-carousel', () => {
    const wrapper = mountFunction({
      props: {
        src: imageSrc,
      },
    })

    expect(warning).toHaveBeenTipped()
  })
})

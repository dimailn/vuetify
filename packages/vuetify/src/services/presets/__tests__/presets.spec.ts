// Types
import Framework from '../../../framework'
import { Breakpoint } from 'vuetify/types/services/breakpoint'
import { Icons } from 'vuetify/types/services/icons'
import { Lang } from 'vuetify/types/services/lang'
import { Theme } from 'vuetify/types/services/theme'

describe('$vuetify.presets', () => {
  it('should merge user and default preset', () => {
    const vuetify = new Framework({
      rtl: true,
      breakpoint: {
        thresholds: { xs: 200 }
      },
      icons: {
        iconfont: 'md',
        values: { complete: 'bar' }
      },
      lang: {
        locales: {
          en: {
            badge: 'Foobar',
            dataIterator: { noResultsText: 'Fizzbuzz' }
          }
        }
      },
      theme: {
        dark: true,
        themes: {
          light: {
            primary: 'blue',
            // https://github.com/vuetifyjs/vuetify/issues/10100
            secondary: { darken4: 'red' }
          }
        }
      }
    })

    expect(JSON.stringify(vuetify.preset)).toMatchSnapshot()

    const icons: Icons = vuetify.framework as any
    const lang: Lang = vuetify.framework.lang as any
    const itheme: Theme = vuetify.framework.theme as any
    const breakpoints: Breakpoint = vuetify.framework.breakpoint as any

    expect(JSON.stringify(icons.values)).toMatchSnapshot()
    expect(JSON.stringify(lang.locales)).toMatchSnapshot()
    expect(JSON.stringify(itheme.themes)).toMatchSnapshot()
    expect(JSON.stringify(breakpoints.thresholds)).toMatchSnapshot()
  })

  it('should prevent prototype pollution from malicious presets', () => {
    const polluted = {}

    expect((polluted as any).isPolluted).toBeUndefined()

    const vuetify = new Framework({
      preset: JSON.parse('{"__proto__":{"isPolluted":"yes"}}')
    })

    expect(({} as any).isPolluted).toBeUndefined()
    expect((vuetify.preset as any).isPolluted).toBeUndefined()
  })
})

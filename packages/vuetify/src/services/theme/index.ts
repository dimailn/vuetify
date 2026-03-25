/* eslint-disable no-multi-spaces */
// Extensions
import { Service } from '../service'

// Utilities
import * as ThemeUtils from './utils'
import { getNestedValue } from '../../util/helpers'

// Types
import { reactive } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { VuetifyPreset } from 'vuetify/types/services/presets'
import {
  VuetifyParsedTheme,
  VuetifyThemes,
  VuetifyThemeVariant,
  Theme as ITheme
} from 'vuetify/types/services/theme'

// Vue Meta 3
import { createMetaManager, useMeta } from 'vue-meta'

export class Theme extends Service {
  static property: 'theme' = 'theme'

  public disabled = false

  public options: ITheme['options']

  public styleEl?: HTMLStyleElement

  public themes: VuetifyThemes

  public defaults: VuetifyThemes

  private isDark = null as boolean | null

  private unwatch = null as (() => void) | null

  private metaManager: any = null

  constructor (preset: VuetifyPreset) {
    super()

    const {
      dark,
      disable,
      options,
      themes
    } = preset[Theme.property]

    this.dark = Boolean(dark)
    this.defaults = this.themes = themes
    this.options = options

    if (disable) {
      this.disabled = true

      return
    }

    this.themes = {
      dark: this.fillVariant(themes.dark, true),
      light: this.fillVariant(themes.light, false)
    }
  }

  // When setting css, check for element and apply new values
  /* eslint-disable-next-line accessor-pairs */
  set css (val: string) {
    if (this.metaManager) {
      this.applyVueMeta3(val)
      return
    }
    this.checkOrCreateStyleElement() && (this.styleEl!.innerHTML = val)
  }

  set dark (val: boolean) {
    const oldDark = this.isDark

    this.isDark = val
    // Only apply theme after dark
    // has already been set before
    oldDark != null && this.applyTheme()
  }

  get dark () {
    return Boolean(this.isDark)
  }

  // Apply current theme default
  // only called on client side
  public applyTheme (): void {
    if (this.disabled) return this.clearCss()

    this.css = this.generatedStyles
  }

  public clearCss (): void {
    this.css = ''
  }

  // Initialize theme for SSR and SPA
  // Attach to ssrContext head or
  // apply new theme to document
  public init (root: ComponentPublicInstance, ssrContext?: any): void {
    if (this.disabled) return

    // Инициализируем vue-meta 3
    this.initVueMeta3(root)

    if (ssrContext) {
      this.initSSR(ssrContext)
    } else {
      this.initTheme(root)
    }
  }

  // Allows for you to set target theme
  public setTheme (theme: 'light' | 'dark', value: object) {
    this.themes[theme] = Object.assign(this.themes[theme], value)
    this.applyTheme()
  }

  // Reset theme defaults
  public resetThemes () {
    this.themes.light = Object.assign({}, this.defaults.light)
    this.themes.dark = Object.assign({}, this.defaults.dark)
    this.applyTheme()
  }

  // Check for existence of style element
  private checkOrCreateStyleElement (): boolean {
    this.styleEl = document.getElementById('vuetify-theme-stylesheet') as HTMLStyleElement

    /* istanbul ignore next */
    if (this.styleEl) return true

    this.genStyleElement() // If doesn't have it, create it

    return Boolean(this.styleEl)
  }

  private fillVariant (
    theme: Partial<VuetifyThemeVariant> = {},
    dark: boolean
  ): VuetifyThemeVariant {
    const defaultTheme = this.themes[dark ? 'dark' : 'light']

    return Object.assign({},
      defaultTheme,
      theme
    )
  }

  // Generate the style element
  // if applicable
  private genStyleElement (): void {
    /* istanbul ignore if */
    if (typeof document === 'undefined') return

    /* istanbul ignore next */
    this.styleEl = document.createElement('style')
    this.styleEl.type = 'text/css'
    this.styleEl.id = 'vuetify-theme-stylesheet'

    if (this.options.cspNonce) {
      this.styleEl.setAttribute('nonce', this.options.cspNonce)
    }

    document.head.appendChild(this.styleEl)
  }

  private initVueMeta3 (_root: ComponentPublicInstance) {
    // Vue Meta 3 теперь работает через плагин, а не через отдельный manager
    // Стили будут добавляться напрямую через useMeta API в компонентах
    // или через обычный DOM API
    this.metaManager = null
  }

  private applyVueMeta3 (css: string) {
    // Vue Meta 3 больше не использует manager.addMeta API
    // Используем обычный DOM API для обновления стилей
    this.checkOrCreateStyleElement() && (this.styleEl!.innerHTML = css)
  }

  private initSSR (ssrContext?: any) {
    // SSR
    const nonce = this.options.cspNonce ? ` nonce="${this.options.cspNonce}"` : ''
    ssrContext.head = ssrContext.head || ''
    ssrContext.head += `<style type="text/css" id="vuetify-theme-stylesheet"${nonce}>${this.generatedStyles}</style>`
  }

  private initTheme (_root: ComponentPublicInstance) {
    // Only watch for reactivity on client side
    if (typeof document === 'undefined') return

    // If we get here somehow, ensure
    // existing instance is removed
    if (this.unwatch) {
      this.unwatch()
      this.unwatch = null
    }

    // TODO: Update to use RFC if merged
    // https://github.com/vuejs/rfcs/blob/advanced-reactivity-api/active-rfcs/0000-advanced-reactivity-api.md

    // root.$once('hook:created', () => {
    //   const obs = reactive({ themes: this.themes })
    //   this.unwatch = root.$watch(() => obs.themes, () => this.applyTheme(), { deep: true })
    // })

    this.applyTheme()
  }

  get currentTheme () {
    const target = this.dark ? 'dark' : 'light'

    return this.themes[target]
  }

  get generatedStyles (): string {
    const theme = this.parsedTheme
    /* istanbul ignore next */
    const options = this.options || {}
    let css

    if (options.themeCache != null) {
      css = options.themeCache.get(theme)
      /* istanbul ignore if */
      if (css != null) return css
    }

    css = ThemeUtils.genStyles(theme, options.customProperties)

    if (options.minifyTheme != null) {
      css = options.minifyTheme(css)
    }

    if (options.themeCache != null) {
      options.themeCache.set(theme, css)
    }

    return css
  }

  get parsedTheme (): VuetifyParsedTheme {
    return ThemeUtils.parse(
      this.currentTheme || {},
      undefined,
      getNestedValue(this.options, ['variations'], true)
    )
  }

  // Vue Meta 3 больше не нужен isVueMeta23 метод
}

/**
 * Внутренности рендера/директив (ctx и т.д.) — не публичный API Vue.
 */
import 'vue'

declare module 'vue' {
  export interface VNode {
    ctx?: any
    componentInstance?: any
  }

  export interface App {
    $_vuetify_installed?: boolean
  }
}

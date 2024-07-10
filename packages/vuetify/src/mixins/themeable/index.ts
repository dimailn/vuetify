import {defineComponent, App} from 'vue'
import { PropType, RenderContext } from 'vue/types/options'

interface options extends App {
  theme: {
    isDark: boolean
  }
}

/* @vue/component */
const Themeable = defineComponent({
  name: 'themeable',

  provide (): object {
    return {
      theme: this.themeableProvide,
    }
  },

  inject: {
    theme: {
      default: {
        isDark: false,
      },
    },
  },

  props: {
    dark: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    light: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
  },

  data () {
    return {
      themeableProvide: {
        isDark: false,
      },
    }
  },

  computed: {
    appIsDark (): boolean {
      return this.$vuetify.theme.dark || false
    },
    isDark (): boolean {
      if (this.dark === true) {
        // explicitly dark
        return true
      } else if (this.light === true) {
        // explicitly light
        return false
      } else {
        // inherit from parent, or default false if there is none
        return this.theme.isDark
      }
    },
    themeClasses (): object {
      return {
        'theme--dark': this.isDark,
        'theme--light': !this.isDark,
      }
    },
    /** Used by menus and dialogs, inherits from v-app instead of the parent */
    rootIsDark (): boolean {
      if (this.dark === true) {
        // explicitly dark
        return true
      } else if (this.light === true) {
        // explicitly light
        return false
      } else {
        // inherit from v-app
        return this.appIsDark
      }
    },
    rootThemeClasses (): Dictionary<boolean> {
      return {
        'theme--dark': this.rootIsDark,
        'theme--light': !this.rootIsDark,
      }
    },
  },

  watch: {
    isDark: {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.themeableProvide.isDark = this.isDark
        }
      },
      immediate: true,
    },
  },
})

export default Themeable

export function functionalThemeClasses (vm: any): object {
  const isDark = Themeable.computed.isDark.call(vm)
  return Themeable.computed.themeClasses.call({ isDark })
}

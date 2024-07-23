import {defineComponent} from 'vue'
import { VNodeData } from 'vue/types/vnode'
import { consoleError } from '../../util/console'
import { isCssColor } from '../../util/colorUtils'

export default defineComponent({
  name: 'colorable',

  props: {
    color: String,
  },

  methods: {
    setBackgroundColor (color?: string | false, data: VNodeData = {}): VNodeData {
      if (typeof data.style === 'string') {
        // istanbul ignore next
        consoleError('style must be an object', this)
        // istanbul ignore next
        return data
      }
      if (typeof data.class === 'string') {
        data.class = {
          [data.class]: true
        }
        // istanbul ignore next
        // consoleError('class must be an object', this)
        // istanbul ignore next
        // return data
      }

      if(data.class instanceof Array) {
        data.class = data.class.reduce((classes, current) => {
          if(typeof current === 'string') {
            classes[current] = true
          }

          if(typeof current === 'object') {
            classes = {
              ...classes,
              ...current
            }
          }

          return classes
        }, {})
      }

      if (isCssColor(color)) {
        data.style = {
          ...data.style as object,
          'background-color': `${color}`,
          'border-color': `${color}`,
        }
      } else if (color) {
        data.class = {
          ...data.class,
          [color]: true,
        }
      }

      return data
    },

    setTextColor (color?: string | false, data: VNodeData = {}): VNodeData {
      if (typeof data.style === 'string') {
        // istanbul ignore next
        consoleError('style must be an object', this)
        // istanbul ignore next
        return data
      }
      if (typeof data.class === 'string') {
        // istanbul ignore next
        consoleError('class must be an object', this)
        // istanbul ignore next
        return data
      }

      if (data.class instanceof Array) {
        data.class = data.class.reduce((classes, current) => {
          if(typeof current === 'string') {
            classes[current] = true
          } else if(typeof current === 'object') {
            classes = {
              ...classes,
              ...current
            }
          } else {
            console.error(`Unknown type of class ${typeof current}`)
          }

          return classes
        }, {})
      }

      if (isCssColor(color)) {
        data.style = {
          ...data.style as object,
          color: `${color}`,
          'caret-color': `${color}`,
        }
      } else if (color) {
        const [colorName, colorModifier] = color.toString().trim().split(' ', 2) as (string | undefined)[]
        data.class = {
          ...data.class,
          [colorName + '--text']: true,
        }
        if (colorModifier) {
          data.class['text--' + colorModifier] = true
        }
      }

      return data
    },
  },
})

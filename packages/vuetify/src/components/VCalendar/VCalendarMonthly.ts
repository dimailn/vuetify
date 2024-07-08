// Styles
import './VCalendarWeekly.sass'

// Mixins
import VCalendarWeekly from './VCalendarWeekly'

// Util
import { parseTimestamp, getStartOfMonth, getEndOfMonth } from './util/timestamp'
import { CalendarTimestamp } from 'vuetify/types'
import { defineComponent } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-calendar-monthly',
  extends: VCalendarWeekly,

  computed: {
    staticClass (): string {
      return 'v-calendar-monthly v-calendar-weekly'
    },
    parsedStart (): CalendarTimestamp {
      return getStartOfMonth(parseTimestamp(this.start, true))
    },
    parsedEnd (): CalendarTimestamp {
      return getEndOfMonth(parseTimestamp(this.end, true))
    },
  },

})

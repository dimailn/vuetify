import {defineComponent} from 'vue'
import { PropType } from 'vue'
import { deepEqual } from '../../util/helpers'

export default defineComponent({
  name: 'comparable',
  props: {
    valueComparator: {
      type: Function,
      default: deepEqual,
    } as PropType<typeof deepEqual>,
  },
})

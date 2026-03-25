import { defineComponent, PropType } from 'vue'
import { deepEqual } from '../../util/helpers'

export default defineComponent({
  name: 'comparable',
  props: {
    valueComparator: {
      type: Function,
      default: deepEqual
    } as unknown as PropType<typeof deepEqual>
  }
})

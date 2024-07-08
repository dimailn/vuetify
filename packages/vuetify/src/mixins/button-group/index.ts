// Extensions
import { defineComponent } from 'vue'
import { BaseItemGroup } from '../../components/VItemGroup/VItemGroup'

/* @vue/component */
export default defineComponent({
  name: 'button-group',
  extends: BaseItemGroup,

  provide (): object {
    return {
      btnToggle: this,
    }
  },

  computed: {
    classes (): object {
      return BaseItemGroup.classes.call(this)
    },
  },

  methods: {
    // Isn't being passed down through types
    genData: BaseItemGroup.methods.genData,
  },
})

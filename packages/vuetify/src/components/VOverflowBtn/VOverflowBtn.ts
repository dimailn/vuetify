// Styles
import './VOverflowBtn.sass'

// Extensions
import VSelect from '../VSelect/VSelect'
import VAutocomplete from '../VAutocomplete'
import VTextField from '../VTextField/VTextField'

// Components
import VBtn from '../VBtn'

// Utilities
import { consoleWarn } from '../../util/console'
import { defineComponent, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-overflow-btn',

  extends: VAutocomplete,

  props: {
    editable: Boolean,
    segmented: Boolean
  },

  emits: ['change'],

  computed: {
    classes (): object {
      return {
        ...VAutocomplete.computed.classes.call(this),
        'v-overflow-btn': true,
        'v-overflow-btn--segmented': this.segmented,
        'v-overflow-btn--editable': this.editable
      }
    },
    isAnyValueAllowed (): boolean {
      return this.editable ||
        VAutocomplete.computed.isAnyValueAllowed.call(this)
    },
    isSingle (): true {
      return true
    },
    computedItems (): object[] {
      return this.segmented ? this.allItems : this.filteredItems
    },
    labelValue (): boolean {
      return (this.isFocused && !this.persistentPlaceholder) || this.isLabelActive
    }
  },

  methods: {
    genSelections () {
      return this.editable
        ? VAutocomplete.methods.genSelections.call(this)
        : VSelect.methods.genSelections.call(this) // Override v-autocomplete's override
    },
    genCommaSelection (item: any, index: number, last: boolean) {
      return this.segmented
        ? this.genSegmentedBtn(item)
        : VSelect.methods.genCommaSelection.call(this, item, index, last)
    },
    genInput () {
      const input = VTextField.methods.genInput.call(this)

      // Ensure data object exists
      if (!input.props) {
        input.props = {}
      }

      // Set value and readonly properties
      input.props.value = this.editable ? this.internalSearch : ''
      input.props.readonly = !this.isAnyValueAllowed

      return input
    },
    genLabel () {
      if (this.editable && this.isFocused) return null

      const label = VTextField.methods.genLabel.call(this)

      if (!label) return label

      label.props ||= {}

      // Label must stay in document flow to size the control
      // (.v-select__selections has width: 0).
      // Do not use position:relative — it activates CSS `top` and breaks alignment.
      label.props.absolute = false
      label.props.left = ''
      label.props.right = ''
      label.props.style = {}

      return label
    },
    genSegmentedBtn (item: any) {
      const itemValue = this.getValue(item)
      const itemObj = this.computedItems.find(i => this.getValue(i) === itemValue) || item

      if (!itemObj.text || !itemObj.callback) {
        consoleWarn('When using "segmented" prop without a selection slot, items must contain both a text and callback property', this)
        return null
      }

      return h(VBtn, {
        text: true,
        onClick: (e: Event) => {
          e.stopPropagation()
          itemObj.callback(e)
        }
      }, () => [itemObj.text])
    },
    updateValue (val: boolean) {
      if (val) {
        this.initialValue = this.lazyValue
      } else if (this.initialValue !== this.lazyValue) {
        this.$emit('change', this.lazyValue)
      }
    }
  }
})

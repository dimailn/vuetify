<template>
  <i18n-t
    :keypath="keypath || path"
    :class="`text-${size} font-weight-${weight} text--${color}`"
    :tag="tag"
    v-bind="attrsWithoutPath"
  />
</template>

<script>
  export default {
    name: 'Headline',

    props: {
      color: {
        type: String,
        default: 'primary',
      },
      size: {
        type: String,
        default: 'h6',
      },
      tag: {
        type: String,
        default: 'div',
      },
      weight: {
        type: String,
        default: 'medium',
      },
      path: String,
      keypath: String,
    },

    computed: {
      attrsWithoutPath () {
        const attrs = { ...this.$attrs }
        delete attrs.path
        return attrs
      },
    },
  }
</script>

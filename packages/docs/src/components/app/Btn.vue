<template>
  <v-btn
    class="v-btn--app text--secondary text-capitalize font-weight-regular px-2"
    v-bind="{
      text: true,
      ...forwardedAttrs,
    }"
  >
    <slot v-if="$slots.default" />

    <i18n-t
      v-else-if="path"
      :keypath="path"
    />
  </v-btn>
</template>

<script>
  export default {
    name: 'AppBtn',

    inheritAttrs: false,

    props: { path: String },

    computed: {
      forwardedAttrs () {
        // `ref` from legacy activator bindings breaks on hoisted vnode in Vue 3
        const { ref, ...attrs } = this.$attrs
        return attrs
      },
    },
  }
</script>

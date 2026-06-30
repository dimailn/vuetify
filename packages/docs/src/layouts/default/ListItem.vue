<template>
  <v-list-item
    :href="item.href || undefined"
    :to="item.href ? undefined : item.to || undefined"
    :rel="item.href ? 'nofollow' : undefined"
    :target="item.href ? '_blank' : undefined"
    class="v-list-item--default"
    color="primary"
    v-bind="forwardedAttrs"
  >
    <v-list-item-icon v-if="item.icon">
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>

    <!-- <v-avatar
      v-if="item.recent || item.fresh"
      class="flex-0-1-auto mr-2 ml-n3"
      color="#00C58E"
      size="4"
    /> -->

    <v-list-item-content>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: 'DefaultListItem',

    inheritAttrs: false,

    props: {
      item: {
        type: Object,
        default: () => ({}),
      },
    },

    computed: {
      forwardedAttrs () {
        const { ref, ...attrs } = this.$attrs
        return attrs
      },
    },
  }
</script>

<style lang="sass">
  .v-list-item.v-list-item.v-list-item--default
    min-height: 32px

    > .v-list-item__icon
      margin-bottom: 6px
      margin-top: 6px
</style>

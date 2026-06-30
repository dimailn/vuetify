<template>
  <v-menu
    ref="menu"
    bottom
    close-delay="100"
    content-class="rounded"
    left
    max-height="500"
    offset-y
    open-delay="60"
    :open-on-hover="openOnHover"
    transition="slide-y-transition"
    v-bind="{ ...menuModelProps, ...$attrs }"
  >
    <template #activator="props">
      <slot
        name="activator"
        v-bind="{ ...props }"
      />
    </template>

    <app-sheet :outlined="false">
      <slot v-if="$slots.default" />

      <default-list
        v-else
        :items="items"
      >
        <template
          v-if="$slots.item"
          #item="props"
        >
          <slot
            name="item"
            v-bind="{ ...props }"
          />
        </template>
      </default-list>
    </app-sheet>
  </v-menu>
</template>

<script>
  // Components
  import DefaultList from '@/layouts/default/List'

  export default {
    name: 'AppMenu',

    components: { DefaultList },

    emits: ['update:modelValue'],

    props: {
      modelValue: {
        type: Boolean,
        default: undefined,
      },
      items: {
        type: Array,
        default: () => ([]),
      },
      openOnHover: {
        type: Boolean,
        default: true,
      },
    },

    computed: {
      menuModelProps () {
        if (this.modelValue === undefined) return {}

        return {
          modelValue: this.modelValue,
          'onUpdate:modelValue': value => this.$emit('update:modelValue', value),
        }
      },
    },
  }
</script>

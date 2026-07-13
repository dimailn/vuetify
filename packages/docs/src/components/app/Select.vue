<template>
  <v-select
    :model-value="modelValue"
    :background-color="(!theme.isDark && !isFocused) ? 'grey lighten-3' : undefined"
    :flat="!isFocused"
    class="rounded-lg"
    dense
    hide-details
    solo
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
    @focus="isFocused = true"
    @blur="isFocused = false"
  >
    <template
      v-if="$slots.icon || icon"
      #prepend-inner
    >
      <v-icon
        :color="!isFocused ? 'grey' : undefined"
        class="mr-2"
      >
        <slot
          v-if="$slots.icon"
          name="icon"
        />

        <template v-else>
          {{ icon }}
        </template>
      </v-icon>
    </template>
  </v-select>
</template>

<script>
  // This behavior should be easier to do with solo fields
  // TODO: Review this for v3
  export default {
    name: 'AppSelect',

    inject: ['theme'],

    props: {
      icon: String,
      modelValue: null,
    },

    emits: ['update:modelValue'],

    data: () => ({
      isFocused: false,
    }),
  }
</script>

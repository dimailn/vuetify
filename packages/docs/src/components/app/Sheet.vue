<template>
  <v-sheet
    class="overflow-hidden"
    v-bind="{
      outlined: true,
      rounded: true,
      ...$attrs,
    }"
  >
    <slot />
  </v-sheet>
</template>

<script>
  export default { name: 'AppSheet' }
</script>

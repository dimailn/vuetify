<template>
  <v-main>
    <router-view v-slot="{ Component, route }">
      <v-fade-transition mode="out-in">
        <component :is="Component" :key="route.path" />
      </v-fade-transition>
    </router-view>
  </v-main>
</template>

<script>
  export default {
    name: 'DefaultView',
  }
</script>

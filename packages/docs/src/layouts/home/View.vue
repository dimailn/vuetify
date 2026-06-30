<template>
  <v-main>
    <v-container class="px-9 text-center font-weight-light">
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-container>
  </v-main>
</template>

<script>
  export default {
    name: 'HomeView',
  }
</script>

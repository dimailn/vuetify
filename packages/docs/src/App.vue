<template>
  <router-view v-slot="{ Component }">
    <v-fade-transition appear>
      <component :is="Component" />
    </v-fade-transition>
  </router-view>
</template>

<script>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useHead } from '@unhead/vue'
  // Utilities
  import { call } from 'vuex-pathify'
  import { genAppMetaInfo } from '@/util/metadata'
  import { wait, waitForReadystate } from '@/util/helpers'

  // Data
  import metadata from '@/data/metadata'

  export default {
    name: 'App',

    setup () {
      const route = useRoute()
      useHead(
        computed(() => {
          const base = genAppMetaInfo(metadata)
          const suffix = route.name !== 'Home' ? ' — Vuetify' : ''
          return {
            title: base.title,
            titleTemplate: suffix ? `%s${suffix}` : undefined,
            link: base.link,
            meta: base.meta,
          }
        }),
      )
    },

    computed: {
      /** Явные геттеры: vuex-pathify get() в связке с Vue 3 даёт «no getter» */
      hash () {
        return this.$store.state.route?.hash ?? ''
      },
      routeName () {
        return this.$store.state.route?.name ?? ''
      },
      scrolling: {
        get () {
          return this.$store.state.app.scrolling
        },
        set (v) {
          this.$store.commit('app/scrolling', v)
        },
      },
    },

    async mounted () {
      await waitForReadystate()
      await this.init()

      if (!this.hash) return

      await wait(500)

      this.scrolling = true

      try {
        await this.$vuetify.goTo(this.hash)
      } catch (e) {
        console.log(e)
      }

      this.scrolling = false
    },

    methods: { init: call('app/init') },
  }
</script>

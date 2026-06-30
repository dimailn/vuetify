<template>
  <v-container
    class="pa-4 pa-sm-6 pa-md-8"
    fluid
    tag="section"
  >
    <v-responsive
      :max-width="category !== 'api' ? 868 : 1368"
      class="mx-auto overflow-visible"
    >
      <keep-alive max="3">
        <component :is="component" />
      </keep-alive>
    </v-responsive>
  </v-container>
</template>

<script>
  import { computed } from 'vue'
  import { useHead } from '@unhead/vue'
  import { useStore } from 'vuex'

  // Utilities
  import { error } from '@/util/routes'
  import { genMetaInfo } from '@/util/metadata'
  import { get, sync } from 'vuex-pathify'
  import { IN_BROWSER } from '@/util/globals'
  import { localeLookup } from '@/i18n/util'

  function normalizeMarkdownModule (md) {
    return md?.default || md || {}
  }

  function createMarkdownFallbackComponent (md) {
    const source = md?.body || md?.html || ''
    if (!source) return undefined

    return { template: `<div class="markdown-body">${source}</div>` }
  }

  async function load (route) {
    const { category, page } = route.params
    const isApi = category === 'api'
    const locale = localeLookup(route.params.locale)

    const context = isApi
      ? await import(
        /* webpackChunkName: "api-[request]" */
        `@/api/${locale}.js`
      )
      : await import(
        /* webpackChunkName: "documentation-[request]" */
        `@/pages/${locale}.js`
      )

    const path = ['.']

    if (!isApi) path.push(category)

    path.push(page)
    const request = `${path.join('/')}.md`

    try {
      const loaded = normalizeMarkdownModule(context.default(request))
      return loaded
    } catch (err) {
      return {
        vue: {
          component: (await error()).default,
        },
      }
    }
  }

  export default {
    name: 'DocumentationView',

    setup () {
      const store = useStore()
      useHead(computed(() => {
        const fm = store.state.pages?.frontmatter
        if (!fm?.meta) return {}

        const {
          description = '',
          keywords = '',
          title = '',
        } = fm.meta

        return genMetaInfo(title, description, keywords)
      }))
    },

    async asyncData ({ route, store }) {
      const md = await load(route)
      const normalized = normalizeMarkdownModule(md)

      store.state.pages.md = normalized
    },

    data: () => ({ component: undefined }),

    computed: {
      ...sync('pages', [
        'frontmatter',
        'toc',
        'md',
      ]),
      ...get('route', [
        'hash',
        'params@category',
        'params@page',
      ]),
    },

    async created () {
      if (IN_BROWSER && !this.$vuetify.isHydrating) {
        await this.$options.asyncData({
          route: this.$route,
          store: this.$store,
        })
      }

      this.init(this.md)

      const { assets = [], actions = [] } = this.frontmatter || {}

      this.$load(assets)

      for (const action of actions) {
        this.$store.dispatch(action)
      }
    },

    methods: {
      init (md = {}) {
        md = normalizeMarkdownModule(md)

        const {
          attributes = {},
          toc = [],
          vue = {},
        } = md

        // vue.component.name = this.page

        this.frontmatter = attributes
        this.toc = toc
        this.component = vue.component || createMarkdownFallbackComponent(md)
      },
    },
  }
</script>

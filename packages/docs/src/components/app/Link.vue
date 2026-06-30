<script>
  import { h } from 'vue'

  // Components
  import { VIcon } from 'vuetify/lib/components/VIcon'

  // Utilities
  import { rpath } from '@/util/routes'

  export default {
    name: 'AppLink',

    inheritAttrs: false,

    props: {
      href: {
        type: String,
        default: '',
      },
    },

    computed: {
      attrs () {
        return this.isExternal
          ? { href: this.href, target: '_blank', rel: 'noopener' }
          : {
            to: {
              path: this.isSamePage ? this.href : rpath(this.href),
            },
          }
      },
      icon () {
        if (this.isSamePage) return '$mdiPound'
        if (this.isExternal) return '$mdiOpenInNew'
        if (this.href) return '$mdiPageNext'

        return null
      },
      isExternal () {
        return (
          this.href.startsWith('http') ||
          this.href.startsWith('mailto')
        )
      },
      isSamePage () {
        return (
          !this.isExternal &&
          this.href.startsWith('#')
        )
      },
    },

    methods: {
      // vue-router scroll-behavior is skipped
      // on same page hash changes. Manually
      // run $vuetify goTo scroll function
      onClick (e) {
        if (!this.isSamePage) return

        e.preventDefault()

        this.$vuetify.goTo(this.href)
      },
    },

    render () {
      const children = []
      const slot = this.$slots.default ? this.$slots.default() : []

      if (!this.isExternal && !this.attrs.to) {
        return null
      }

      if (!this.isSamePage) children.push(...slot)
      if (this.icon) {
        children.push(h(VIcon, {
          class: `m${this.isSamePage ? 'r' : 'l'}-1`,
          color: 'primary',
          size: '.875rem',
        }, [this.icon]))
      }
      if (this.isSamePage) children.push(...slot)

      const props = this.isExternal
        ? { ...this.attrs, onClick: this.onClick }
        : { ...this.attrs, onClick: this.onClick }

      return h(this.isExternal ? 'a' : 'router-link', {
        class: 'app-link text-decoration-none primary--text font-weight-medium d-inline-block',
        ...props,
      }, children)
    },
  }
</script>

<style lang="sass">
  .app-link
    p
      margin-bottom: 0
</style>

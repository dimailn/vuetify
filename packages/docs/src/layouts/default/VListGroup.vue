<script>
  // Extensions
  import { VListGroup } from 'vuetify/lib'

  // Utilities
  import { get } from 'vuex-pathify'

  export default {
    name: 'VListGroup',

    extends: VListGroup,

    computed: { scrolling: get('app/scrolling') },

    methods: {
      onRouteChange (to) {
        if (this.scrolling) return

        const baseOnRouteChange = VListGroup?.methods?.onRouteChange

        if (typeof baseOnRouteChange === 'function') {
          baseOnRouteChange.call(this, to)
          return
        }

        if (!this.group || typeof this.matchRoute !== 'function') return

        const isActive = this.matchRoute(to.path)

        if (isActive && this.isActive !== isActive && this.list) {
          this.list.listClick(this.$.uid)
        }

        this.isActive = isActive
      },
    },
  }
</script>

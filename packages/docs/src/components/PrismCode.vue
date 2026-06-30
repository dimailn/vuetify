<template>
  <!--
    Локальная Vue 3-совместимая замена vue-prism-component@1.2.0.
    Оригинал — Vue 2 functional-компонент с сигнатурой render(h, ctx) и ctx.props,
    что в Vue 3 падает: `Cannot read properties of undefined (reading 'code')`.
    Повторяем поведение: подсветка через Prism.highlight, обёртка <pre>/<code>
    (или <code> для inline), класс `language-<lang>`.
  -->
  <code
    v-if="inline"
    :class="className"
    v-html="highlighted"
  />
  <pre
    v-else
    :class="className"
  ><code :class="className" v-html="highlighted" /></pre>
</template>

<script>
  // Тот же prismjs, что импортирует Markup.vue (регистрация языков происходит там)
  import Prism from 'prismjs'

  export default {
    name: 'PrismCode',

    props: {
      code: {
        type: String,
        default: '',
      },
      inline: {
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        default: 'markup',
      },
    },

    computed: {
      className () {
        return `language-${this.language}`
      },
      highlighted () {
        const grammar = Prism.languages[this.language]
        if (!grammar) return this.code
        return Prism.highlight(this.code || '', grammar, this.language)
      },
    },
  }
</script>

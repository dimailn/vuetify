<template>
  <form>
    <v-text-field
      v-model="name"
      :error-messages="nameErrors"
      :counter="10"
      label="Name"
      required
      @input="() => v$.name.$touch()"
      @blur="() => v$.name.$touch()"
    />
    <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @input="() => v$.email.$touch()"
      @blur="() => v$.email.$touch()"
    />
    <v-select
      v-model="select"
      :items="items"
      :error-messages="selectErrors"
      label="Item"
      required
      @update:model-value="() => v$.select.$touch()"
      @blur="() => v$.select.$touch()"
    />
    <v-checkbox
      v-model="checkbox"
      :error-messages="checkboxErrors"
      label="Do you agree?"
      required
      @update:model-value="() => v$.checkbox.$touch()"
      @blur="() => v$.checkbox.$touch()"
    />

    <v-btn
      class="mr-4"
      @click="submit"
    >
      submit
    </v-btn>
    <v-btn @click="clear">
      clear
    </v-btn>
  </form>
</template>

<script>
  import { reactive, computed, toRefs } from 'vue'
  import useVuelidate from '@vuelidate/core'
  import { required, maxLength, email, helpers } from '@vuelidate/validators'

  const mustBeChecked = helpers.withMessage(
    'You must agree to continue!',
    v => v === true,
  )

  export default {
    name: 'VFormMiscVuelidate',

    setup () {
      const state = reactive({
        name: '',
        email: '',
        select: null,
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4',
        ],
        checkbox: false,
      })

      const rules = {
        name: { required, maxLength: maxLength(10) },
        email: { required, email },
        select: { required },
        checkbox: { mustBeChecked },
      }

      const v$ = useVuelidate(rules, state)

      return {
        ...toRefs(state),
        v$,
      }
    },

    computed: {
      checkboxErrors () {
        const errors = []
        if (!this.v$.checkbox.$dirty) return errors
        this.v$.checkbox.mustBeChecked.$invalid && errors.push('You must agree to continue!')
        return errors
      },
      selectErrors () {
        const errors = []
        if (!this.v$.select.$dirty) return errors
        this.v$.select.required.$invalid && errors.push('Item is required')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.v$.name.$dirty) return errors
        this.v$.name.maxLength.$invalid && errors.push('Name must be at most 10 characters long')
        this.v$.name.required.$invalid && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.v$.email.$dirty) return errors
        this.v$.email.email.$invalid && errors.push('Must be valid e-mail')
        this.v$.email.required.$invalid && errors.push('E-mail is required')
        return errors
      },
    },

    methods: {
      submit () {
        this.v$.$touch()
      },
      clear () {
        this.v$.$reset()
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = false
      },
    },
  }
</script>

<codepen-resources lang="json">
  {
    "js": [
      "https://cdn.jsdelivr.net/npm/@vuelidate/core@2/dist/vuelidate-core.umd.min.js",
      "https://cdn.jsdelivr.net/npm/@vuelidate/validators@2/dist/validators.umd.min.js"
    ]
  }
</codepen-resources>

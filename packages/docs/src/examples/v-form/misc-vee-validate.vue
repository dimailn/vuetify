<template>
  <Form v-slot="{ meta, resetForm }">
    <form @submit.prevent="onSubmit">
      <Field
        v-slot="{ field, errors }"
        name="name"
        rules="required|max:10"
      >
        <v-text-field
          :model-value="field.value"
          :name="field.name"
          :counter="10"
          :error-messages="errors"
          label="Name"
          required
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        name="phoneNumber"
        rules="required|ukPhone"
      >
        <v-text-field
          :model-value="field.value"
          :name="field.name"
          :counter="7"
          :error-messages="errors"
          label="Phone Number"
          required
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        name="email"
        rules="required|email"
      >
        <v-text-field
          :model-value="field.value"
          :name="field.name"
          :error-messages="errors"
          label="E-mail"
          required
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        name="select"
        rules="required"
      >
        <v-select
          :model-value="field.value"
          :items="items"
          :error-messages="errors"
          label="Select"
          required
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
      </Field>
      <Field
        v-slot="{ field, errors, value }"
        name="checkbox"
        type="checkbox"
        :value="true"
        :unchecked-value="false"
      >
        <v-checkbox
          :model-value="value"
          :error-messages="errors"
          label="Option"
          type="checkbox"
          required
          @update:model-value="field.onChange"
        />
      </Field>

      <v-btn
        class="mr-4"
        type="submit"
        :disabled="!meta.valid"
      >
        submit
      </v-btn>
      <v-btn
        type="button"
        @click="onClear(resetForm)"
      >
        clear
      </v-btn>
    </form>
  </Form>
</template>

<script>
  import { Form, Field, defineRule } from 'vee-validate'
  import {
    required,
    email,
    max,
    regex,
    digits,
  } from '@vee-validate/rules'

  defineRule('required', required)
  defineRule('email', email)
  defineRule('max', max)
  defineRule('regex', regex)
  defineRule('digits', digits)

  defineRule('ukPhone', value => {
    if (value === undefined || value === null || value === '') return true
    const s = String(value)
    if (s.length !== 7 || !/^\d+$/.test(s)) {
      return 'Phone must be 7 digits'
    }
    if (!/^(71|72|74|76|81|82|84|85|86|87|88|89)\d{5}$/.test(s)) {
      return 'Phone format is invalid'
    }
    return true
  })

  export default {
    name: 'VFormMiscVeeValidate',

    components: { Form, Field },

    data: () => ({
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
    }),

    methods: {
      onSubmit () {
        // Form validated by vee-validate on submit
      },

      onClear (resetForm) {
        resetForm()
      },
    },
  }
</script>

<codepen-resources lang="json">
  {
    "js": ["https://cdn.jsdelivr.net/npm/vee-validate@4/dist/vee-validate.min.js"]
  }
</codepen-resources>

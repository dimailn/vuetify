// Contracts
import { VuetifyServiceContract } from 'vuetify/types/services/index'

// Types
import type { ComponentPublicInstance } from 'vue'

export class Service implements VuetifyServiceContract {
  framework = {}

  init (root: ComponentPublicInstance, ssrContext?: object) {}
}

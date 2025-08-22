// Global test setup for Jest
// This file is executed before all tests and configures Vue Test Utils globally

import { config } from '@vue/test-utils'
import { legacyEventsMixin } from '../src/util/legacyEventsMixin'

// Configure global mixins for all tests
// This provides $on, $off, and $emitLegacy methods to all components in tests
config.global.mixins = [legacyEventsMixin]

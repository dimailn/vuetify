/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import { registerComponents } from './app'
import { installHead } from './unhead'

export function registerPlugins (app) {
  registerComponents(app)
  return installHead(app)
}

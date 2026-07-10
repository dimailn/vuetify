/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import { loadFonts } from './webfontloader'
import { registerComponents } from './app'
import { installHead } from './unhead'

export function registerPlugins (app) {
  registerComponents(app)
  loadFonts(app)
  return installHead(app)
}

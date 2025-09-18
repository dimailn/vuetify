import { createMetaManager, plugin as VueMeta } from 'vue-meta'

export function useMeta (app) {
  // Создаем meta manager для Vue Meta 3.0.0-alpha.10
  const metaManager = createMetaManager()
  
  // Устанавливаем manager в приложение
  app.use(metaManager)
  app.use(VueMeta) // Плагин для поддержки Options API
  
  // Возвращаем metaManager для использования в SSR
  return metaManager
}

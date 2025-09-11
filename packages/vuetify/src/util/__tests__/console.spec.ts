import { consoleWarn, consoleError, consoleInfo, deprecate, breaking, removed } from '../console'

describe('console', () => {
  beforeEach(() => {
    // Clear console mocks before each test
    jest.clearAllMocks()
  })

  describe('consoleWarn', () => {
    it('should generate a warning', () => {
      consoleWarn('foo')
      expect('[Vuetify] foo').toHaveBeenTipped()
    })

    it('should generate a warning with Vue 3 component', () => {
      const vm = {
        type: { name: 'Vue3Component' },
        props: { color: 'primary', size: 'large' },
        setupState: { isActive: true, count: 0 }
      }
      consoleWarn('Vue 3 warning', vm)
      expect('[Vuetify] Vue 3 warning\n\n(found in <Vue3Component> (props: color, size, setup: isActive, count))').toHaveBeenTipped()
    })

    it('should not show duplicate warnings for same component instance', () => {
      const vm = {
        type: { name: 'TestComponent' },
        props: {},
        setupState: {}
      }
      consoleWarn('duplicate warning', vm)
      consoleWarn('duplicate warning', vm) // Should not show again
      expect('[Vuetify] duplicate warning\n\n(found in <TestComponent>)').toHaveBeenTipped()
    })
  })

  describe('consoleError', () => {
    it('should generate an error', () => {
      consoleError('foo')
      expect('[Vuetify] foo').toHaveBeenWarned()
    })

    it('should generate an error with Vue 3 component', () => {
      const vm = {
        type: { name: 'Vue3ErrorComponent' },
        props: { error: true },
        setupState: { hasError: true }
      }
      consoleError('Vue 3 error', vm)
      expect('[Vuetify] Vue 3 error\n\n(found in <Vue3ErrorComponent> (props: error, setup: hasError))').toHaveBeenWarned()
    })
  })

  describe('deprecate', () => {
    it('should generate deprecation warning', () => {
      deprecate('oldProp', 'newProp')
      expect('[Vuetify] [UPGRADE] \'oldProp\' is deprecated, use \'newProp\' instead.').toHaveBeenTipped()
    })

    it('should generate deprecation warning with Vue 3 component', () => {
      const vm = {
        type: { name: 'DeprecatedComponent' },
        props: {},
        setupState: {}
      }
      deprecate('oldMethod', 'newMethod', vm)
      expect('[Vuetify] [UPGRADE] \'oldMethod\' is deprecated, use \'newMethod\' instead.\n\n(found in <DeprecatedComponent>)').toHaveBeenTipped()
    })
  })

  describe('breaking', () => {
    it('should generate breaking change error', () => {
      breaking('removedProp', 'replacementProp')
      expect('[Vuetify] [BREAKING] \'removedProp\' has been removed, use \'replacementProp\' instead.').toHaveBeenWarned()
    })

    it('should generate breaking change error with Vue 3 component', () => {
      const vm = {
        type: { name: 'BreakingComponent' },
        props: {},
        setupState: {}
      }
      breaking('oldAPI', 'newAPI', vm)
      expect('[Vuetify] [BREAKING] \'oldAPI\' has been removed, use \'newAPI\' instead.\n\n(found in <BreakingComponent>)').toHaveBeenWarned()
    })
  })

  describe('removed', () => {
    it('should generate removal warning', () => {
      removed('unusedProp')
      expect('[Vuetify] [REMOVED] \'unusedProp\' has been removed. You can safely omit it.').toHaveBeenTipped()
    })

    it('should generate removal warning with Vue 3 component', () => {
      const vm = {
        type: { name: 'RemovedComponent' },
        props: {},
        setupState: {}
      }
      removed('unusedMethod', vm)
      expect('[Vuetify] [REMOVED] \'unusedMethod\' has been removed. You can safely omit it.\n\n(found in <RemovedComponent>)').toHaveBeenTipped()
    })
  })

  describe('component name formatting', () => {
    it('should handle anonymous Vue 3 components', () => {
      const vm = {
        type: {},
        props: {},
        setupState: {}
      }
      consoleWarn('anonymous test', vm)
      expect('[Vuetify] anonymous test\n\n(found in <Anonymous>)').toHaveBeenTipped()
    })

    it('should handle Vue 3 root component', () => {
      const vm = {
        appContext: {
          app: {
            _instance: {
              proxy: {}
            }
          }
        }
      }
      // Mock the root check
      vm.appContext.app._instance.proxy = vm
      consoleWarn('root test', vm)
      expect('[Vuetify] root test\n\n(found in <Root>)').toHaveBeenTipped()
    })
  })
})

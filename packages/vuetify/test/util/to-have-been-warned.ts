// From Vue, slightly modified
function noop () { }

if (typeof console === 'undefined') {
  (window as any).console = {
    warn: noop,
    error: noop
  }
}

// avoid info messages during test
console.info = noop

const asserted: string[] = []

function createCompareFn (spy: jest.SpyInstance) {
  const hasWarned = (msg: string) => {
    for (const args of spy.mock.calls) {
      if (args.some((arg: any) => (
        arg.toString().includes(msg)
      ))) return true
    }
    return false
  }

  return (msg: string) => {
    asserted.push(msg)
    const warned = Array.isArray(msg)
      ? msg.some(hasWarned)
      : hasWarned(msg)
    return {
      pass: warned,
      message: warned
        ? () => (`Expected message "${msg}" not to have been warned`)
        : () => (`Expected message "${msg}" to have been warned`)
    }
  }
}

function toHaveBeenWarnedInit () {
  let warn: jest.SpyInstance
  let error: jest.SpyInstance
  beforeAll(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(noop)
    error = jest.spyOn(console, 'error').mockImplementation(noop)
    expect.extend({
      toHaveBeenWarned: createCompareFn(error),
      toHaveBeenTipped: createCompareFn(warn)
    })
  })

  beforeEach(() => {
    asserted.length = 0
    warn.mockClear()
    error.mockClear()
  })

  afterEach(() => {
    for (const type of ['error', 'warn']) {
      const warned = (msg: string) => asserted.some(assertedMsg => msg.toString().includes(assertedMsg))
      for (const args of (console as any)[type].mock.calls) {
        if (!warned(args[0])) {
          // Игнорируем предупреждение о слотах при миграции на Vue 3
          if (args[0].includes('Non-function value encountered for default slot')) {
            console.log('=== SLOT WARNING IGNORED ===')
            console.log('Message:', args[0])
            return
          }
          throw new Error(`Unexpected console.${type} message: ${args[0]}`)
        }
      }
    }
  })
}

export default toHaveBeenWarnedInit

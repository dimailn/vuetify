// Jest custom matchers type definitions

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenTipped(): R
      toHaveBeenWarned(): R
    }
  }
}

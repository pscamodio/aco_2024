/**
 * Assert a condition is true or throws
 *
 * @param condition to check
 * @param message to throw as an error if condition is false
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw Error(message);
  }
}

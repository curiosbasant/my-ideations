/**
 * Pauses execution for a specified number of seconds.
 */
export const sleep = (secs: number) => new Promise((resolve) => setTimeout(resolve, secs * 1000))

/**
 * Wraps a promise and waits for specified time before resolving
 */
export async function withArtificialDelay<T>(promise: Promise<T>, delay = 1) {
  const [result] = await Promise.allSettled([promise, sleep(delay)])
  if (result.status === 'rejected') throw result.reason
  return result.value
}

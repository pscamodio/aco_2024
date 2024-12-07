/**
 * @param f a function to memoize the results for
 * @param computeKey a function to compute the cache key for caching the function result from the inputs @defaults JSON.stringify
 * @returns the memoized version of the passed function
 *
 * The memoized version of the passed function will keep a map of already computed results
 * using the stringification of the
 */
export function memoize<Args extends unknown[], Ret extends unknown>(
  f: (...args: Args) => Ret,
  computeKey: (...args: Args) => string = (...args) => JSON.stringify(args)
): (...args: Args) => Ret {
  const cache_map = new Map<string, Ret>();
  return (...args: Args): Ret => {
    const key = computeKey(...args);
    const cachedRes = cache_map.get(key);
    if (cachedRes) return cachedRes;
    const res = f(...args);
    cache_map.set(key, res);
    return res;
  };
}

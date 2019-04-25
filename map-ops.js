import { IsProxy, GetProxyDetails } from "./proxy-ops.js";

function getResolvedKey(map, key) {
  if (map.has(key)) return key;

  if (!IsProxy(key)) return key;

  const { target, handler } = GetProxyDetails(key);

  if (!("resolve" in handler)) return key;

  const resolvedKey = handler.resolve(target, key, true);

  return resolvedKey;
}

export function mapGet(map, key) {
  return map.get(getResolvedKey(map, key));
}

export function mapHas(map, key) {
  return map.has(getResolvedKey(map, key));
}

export function mapSet(map, key, value, useResolve) {
  const resolvedKey = useResolve ? getResolvedKey(map, key) : key;

  return map.set(resolvedKey, value);
}

export function mapDelete(map, key, useResolve) {
  const resolvedKey = useResolve ? getResolvedKey(map, key) : key;

  return map.delete(resolvedKey);
}

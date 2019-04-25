import { IsProxy, GetProxyDetails } from "./proxy-ops.js";

function getResolvedKey(map, key) {
  if (map.has(key)) return key;

  if (!IsProxy(key)) return key;

  const { target, handler } = GetProxyDetails(key);

  if (!("resolve" in handler)) return key;

  const resolvedKey = handler.resolve(target, key, true);

  return resolvedKey;
}

export function mapGet(map, key, useResolve) {
  const resolvedKey = useResolve === false ? key : getResolvedKey(map, key);

  return map.get(resolvedKey);
}

export function mapHas(map, key, useResolve) {
  const resolvedKey = useResolve === false ? key : getResolvedKey(map, key);

  return map.has(resolvedKey);
}

export function mapSet(map, key, value, useResolve) {
  const resolvedKey = useResolve === false ? key : getResolvedKey(map, key);

  return map.set(resolvedKey, value);
}

export function mapDelete(map, key, useResolve) {
  const resolvedKey = useResolve === false ? key : getResolvedKey(map, key);

  return map.delete(resolvedKey);
}

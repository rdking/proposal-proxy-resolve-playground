import { mapGet, mapHas, mapSet, mapDelete } from "./map-ops.js";
import { NewRevocableProxy } from "./proxy-ops.js";

const proxies = new Map();

const handler = {
  get(target, p, receiver) {
    const { targetInfo, userInfo } = mapGet(proxies, receiver);
    console.log(`get ${targetInfo}.${p} by ${userInfo}`);

    return Reflect.get(target, p, receiver);
  },

  set(target, p, value, receiver) {
    const { targetInfo, userInfo } = mapGet(proxies, receiver);
    console.log(`set ${targetInfo}.${p}=${value} by ${userInfo}`);

    return Reflect.set(target, p, value, receiver);
  },

  resolve(target, receiver, privateIdentity) {
    const { targetInfo, userInfo } = mapGet(proxies, receiver);
    console.log(
      `resolve${
        privateIdentity ? " private identity" : ""
      } on ${targetInfo} by ${userInfo}`
    );

    return privateIdentity ? target : receiver;
  }
};

export function monitor(target, targetInfo, userInfo) {
  if (mapHas(proxies, target)) {
    target = mapGet(proxies, target).target;
  }

  const { proxy, revoke } = NewRevocableProxy(target, handler);

  mapSet(
    proxies,
    proxy,
    {
      target,
      revoke,
      targetInfo,
      userInfo
    },
    false
  );

  return proxy;
}

export function stopMonitoring(proxy) {
  if (!mapHas(proxies, proxy)) return false;

  mapGet(proxies, proxy).revoke();

  return mapDelete(proxies, proxy, false);
}

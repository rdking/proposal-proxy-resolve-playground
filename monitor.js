import AliasingMap, { mapGet, mapHas, mapSet, mapDelete } from "./map-ops.js";
import ResolvableProxy, { NewRevocableProxy } from "./proxy-ops.js";

const proxies = new Map();

// Setting to undefined should not blow up
const useResolve = false;

const handler = {
  get(target, p, receiver) {
    const { targetInfo, userInfo } = mapGet(proxies, receiver, useResolve);
    console.log(`get ${targetInfo}.${p} by ${userInfo}`);

    return Reflect.get(target, p, receiver);
  },

  set(target, p, value, receiver) {
    const { targetInfo, userInfo } = mapGet(proxies, receiver, useResolve);
    console.log(`set ${targetInfo}.${p}=${value} by ${userInfo}`);

    return Reflect.set(target, p, value, receiver);
  },

  resolve(target, receiver, privateIdentity) {
    const { targetInfo, userInfo } = mapGet(proxies, receiver, useResolve);
    console.log(
      `resolve${
        privateIdentity ? " private identity" : ""
      } on ${targetInfo} by ${userInfo}`
    );

    return privateIdentity ? target : receiver;
  }
};

/*
  New Code below this line!
  -------------------------------------------------------------------------
 */

export function monitor(target, targetInfo, userInfo) {
  if (mapHas(proxies, target, useResolve)) {
    target = mapGet(proxies, target, useResolve).target;
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
    useResolve
  );

  return proxy;
}

export function stopMonitoring(proxy) {
  if (!mapHas(proxies, proxy, useResolve)) return false;

  mapGet(proxies, proxy, useResolve).revoke();

  return mapDelete(proxies, proxy, useResolve);
}

export default Monitor = (function() {
  const map = new AliasingMap()
  return class Monitor {
  };
})();

const proxyDetails = new WeakMap();

const proxiesForTarget = new WeakMap();

const proxiedHandler = {
  get(target, p, receiver) {
    const details = proxyDetails.get(receiver);

    if (details) {
      const handler = details.handler;

      if (typeof handler.resolve == "function") {
        receiver = handler.resolve(target, receiver, false);
      }

      if (typeof handler.get == "function") {
        return handler.get(target, p, receiver);
      }
    }

    return Reflect.get(target, p, receiver);
  },

  set(target, p, value, receiver) {
    const details = proxyDetails.get(receiver);

    if (details) {
      const handler = details.handler;

      if (typeof handler.resolve == "function") {
        receiver = handler.resolve(target, receiver, false);
      }

      if (typeof handler.get == "function") {
        return handler.set(target, p, value, receiver);
      }
    }

    return Reflect.set(target, p, value, receiver);
  }
};

function saveProxy(proxy, target, handler) {
  proxyDetails.set(proxy, {
    target,
    handler
  });

  let proxyList = proxiesForTarget.get(target);
  if (!proxyList) {
    proxyList = new Set();
    proxiesForTarget.set(target, proxyList);
  }
  proxyList.add(proxy);
}

export function NewProxy(target, handler) {
  const proxy = new Proxy(target, proxiedHandler);

  saveProxy(proxy, target, handler);

  return proxy;
}

export function NewRevocableProxy(target, handler) {
  const { proxy, revoke } = Proxy.revocable(target, proxiedHandler);

  saveProxy(proxy, target, handler);

  return { proxy, revoke };
}

export function IsProxy(proxy) {
  return proxyDetails.has(proxy);
}

export function GetProxyTarget(proxy) {
  return proxyDetails.get(proxy).target;
}

export function GetProxyHandler(proxy) {
  return proxyDetails.get(proxy).handler;
}

export function GetProxyDetails(proxy) {
  return proxyDetails.get(proxy);
}

export function GetProxiesForTarget(target) {
  return proxiesForTarget.get(target);
}

/*
  New Code below this line!
  -------------------------------------------------------------------------
 */

 export default ResolvableProxy = (function() {
  const map = new WeakMap;

  //Let's pretend that a leading `_` means private
  function isPrivate(field) {
    let retval = false;
    let isPvt = !(["string", "symbol"].includes(typeof(prop)));
  }

  return class ResolvableProxy {
    constructor(target, handler) {
      let retval = Proxy.revocable(target, new Proxy(handler, {
        get(t, key, r) {
          return function(...args) {
            let [tgt, prop] = args;
            let receiver = retval;
            if ((prop != "resolve") && ("resolve" in tgt)) {
              receiver = tgt.resolve(target, receiver, isPrivate(prop), key);
              assert(receiver && (typeof(receiver) == "object"));
            }

            if (key == "get") {
              args[2] = receiver;
            }
            else if (key == "set") {
              args[3] = receiver;
            }
 
            return (handler[key] || Reflect[key])(...args);
          }
        }
      }));
      map.set(retval, target);
      return retval;
    }

    static resolve(receiver, isPrivate, reason) {
      let retval = receiver;
      if (map.has(receiver) && ("resolve" in handler)) {
        let target = map.get(receiver);
        retval = handler.resolve(target, receiver, isPrivate, reason);
        if (!retval || (typeof(retval) != "object")) {
          throw new TypeError("[[Handler]].resolve must return a non-null object.");
        }
      }
      return retval;
    }
  }
})();

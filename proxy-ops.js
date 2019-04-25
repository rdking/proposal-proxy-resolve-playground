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

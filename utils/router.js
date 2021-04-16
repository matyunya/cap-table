export default {
  subscribe: subscriber => {
    const listen = () => subscriber(window.location.hash.slice(1));

    subscriber(window.location.hash.slice(1));
    window.addEventListener("hashchange", listen, false);
    return () => window.removeEventListener("hashchange", listen, false);
  },
  get: () => window.location.hash.slice(1),
  set: hash => window.location.hash = hash,
  update: updater => window.location.hash = updater(window.location.hash)
};

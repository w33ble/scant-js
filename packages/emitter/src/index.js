export default function createEmitter() {
  const events = {};

  const emitter = {
    on(name, fn) {
      if (!events[name]) events[name] = [];
      events[name].push(fn);
      return this;
    },

    off(name, fn) {
      if (!fn) {
        events[name] = [];
      } else {
        events[name] = events[name].filter(eventFn => eventFn !== fn);
      }

      return this;
    },

    emit(name, payload) {
      if (Array.isArray(events[name])) {
        events[name].forEach(fn => fn(payload));
      }
      return this;
    },
  };

  return emitter;
}

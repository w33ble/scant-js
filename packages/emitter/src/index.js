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

    listeners(name) {
      const eventNames = Object.keys(events);
      if (typeof name === 'string') {
        const count = events[name] ? events[name].length : 0;
        return { [name]: count };
      }

      return eventNames.reduce(
        (acc, eventName) => Object.assign(acc, { [eventName]: events[eventName].length }),
        {}
      );
    },
  };

  return emitter;
}

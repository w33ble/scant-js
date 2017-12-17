/* eslint no-param-reassign: 0 */

const wrappedHistoryMethods = ['pushState', 'replaceState'];

export default function createHistoryWrapper(root) {
  const historyCache = {};

  wrappedHistoryMethods.forEach(method => {
    // save reference to the original method
    historyCache[method] = root.history[method];
  });

  return {
    wrap(onChange) {
      wrappedHistoryMethods.forEach(method => {
        // override the method to emit custom event
        root.history[method] = (...args) => {
          historyCache[method].call(root.history, ...args);
          if (typeof onChange === 'function') onChange(args);
        };
      });
    },

    unwrap() {
      wrappedHistoryMethods.forEach(method => {
        // restory the history methods
        root.history[method] = historyCache[method];
      });
    },
  };
}

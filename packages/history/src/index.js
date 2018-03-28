/* eslint no-param-reassign: 0 */

import createEmitter from '@scant/emitter'; // eslint-disable-line import/no-extraneous-dependencies
import createHistoryWrapper from './history_wrapper';

export default function createHistory(root, onChange, options = {}) {
  // TODO: check the root object
  if (!root) throw new Error('History creator requires the window object');

  if (typeof onChange !== 'function') {
    throw new Error('You must provide an onChange function');
  }

  const emitter = createEmitter();
  const historyWrapper = createHistoryWrapper(root);
  const location = options.location || root.history.location || root.location;

  const historyState = {
    onChange,
    running: false,
    options: {
      hashType: options.hashType || '#',
    },
  };

  const popstateEmitter = ev => emitter.emit('popstate', ev.state || {});

  const getPayload = type => ({
    type,
    href: location.href,
    host: location.host,
    hostname: location.hostname,
    pathname: location.pathname,
    port: location.port,
    hash: location.hash,
    search: location.search,
  });

  const history = {
    start() {
      // do nothing if already running
      if (historyState.running) return;

      // set the history state to running
      historyState.running = true;

      // wrap the history property on the root object
      historyWrapper.wrap(([state, title]) => {
        // emit pushstate event when the history changes
        emitter.emit('pushstate', [getPayload('pushstate'), state, title]);
      });

      // watch for history events and call onChange handler
      emitter
        .on('popstate', state => {
          historyState.onChange([getPayload('popstate'), state, '']);
        })
        .on('pushstate', (...args) => {
          historyState.onChange(...args);
        }); // watch custom history event

      // add native history event handlers
      root.addEventListener('popstate', popstateEmitter, false);
    },

    stop() {
      // do nothing if not already running
      if (!historyState.running) return;

      // set the history state to stopped
      historyState.running = false;

      // restore the root object's history property
      historyWrapper.unwrap();

      // remove history event listeners
      emitter.off('popstate').off('pushstate');

      // remove the native history event handlers
      root.removeEventListener('popstate', popstateEmitter, false);
    },

    location() {
      return getPayload('location');
    },

    push(...args) {
      root.history.pushState(...args);
    },

    replace(...args) {
      root.history.replaceState(...args);
    },
  };

  return history;
}

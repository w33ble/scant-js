# @scant/history

Dead simple browser history notifier.

[![npm](https://img.shields.io/npm/v/@scant/history.svg)](https://www.npmjs.com/package/@scant/history)

## Install

```
yarn add @scant/history
```

## Usage

```
import createHistory from '@scant/history';

// configure the handler, passing in the window object and the onChange handler
const historyHandler = createHistory(window, (payload) => {
  const [ location, state, title ] = payload;
  console.log('Browser history changed:', location.href);
})

// start listening for changes to the browser history
historyHandler.start();

// changes to the browser history, using the history api or change the hash, will trigger the handler

// stop listening for history changes
historyHandler.stop();
```

The payload is an array, which contains location information, any state object, and a title. 

The object is a slice of the important parts of `window.location`, as well as a `type` property so you can tell if the event came from the use of `history.pushState` (or `history.replaceState`) or from browser history navigation. This includes the `href`, `host`, `hostname`, `port`, `pathname`, `hash`, and `search`, all taken from the [location object](https://developer.mozilla.org/en-US/docs/Web/API/Location) when the history changed.

Any state object or title comes form the use of [pushState or replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries).

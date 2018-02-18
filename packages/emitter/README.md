# @scant/emitter

Dead simple event emitter.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/scant-js/master/LICENSE)
[![npm](https://img.shields.io/npm/v/@scant/emitter.svg)](https://www.npmjs.com/package/@scant/emitter)
![size](http://img.badgesize.io/https://unpkg.com/@scant/emitter?compression=gzip&label=minzip_size)

## Install

```
yarn add @scant/emitter
```

## Usage

```
import createEmitter from '@scant/emitter';

const emitter = createEmitter();

const handleHello = name => console.log(`hello ${name}!`);

// create a listener
emitter.on('hello', handleHello);

// get count of all listeners
emitter.listeners(); // { hello: 1 }

// get count of listeners by name
emitter.listeners('hello'); // { hello: 1 }
emitter.listeners('farewell'); // { farewell: 0 }

// emit the event, with a payload
emitter.emit('hello', 'world');

// remove the listener
emitter.off('hello', handleHello);

// or, remove ALL listeners on the event
// emitter.off('hello');
```

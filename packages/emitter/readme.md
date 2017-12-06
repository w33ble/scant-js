# @scant/emitter

Dead simple event emitter

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

// emit the event, with a payload
emitter.emit('hello', 'world');

// remove the listener
emitter.off('hello', handleHello);

// or, remove ALL listeners on the event
// emitter.off('hello');
```

import test from 'ava';
import createEmitter from '../src/index';

let emitter;

test.beforeEach(() => {
  emitter = createEmitter();
});

test('calls listeners on emit', t => {
  t.plan(1);
  emitter.on('event', () => t.pass());
  emitter.emit('event');
});

test('calls all listeners on emit', t => {
  t.plan(2);
  emitter.on('event', () => t.pass());
  emitter.on('event', () => t.pass());
  emitter.emit('event');
});

test('passes payload to listener', t => {
  t.plan(1);
  const payload = { hello: 'world' };
  emitter.on('event', p => t.is(p, payload));
  emitter.emit('event', payload);
});

test('removes listeners by handler function', t => {
  t.plan(3);
  const handler = num => t.true(num === 2);

  // add two listeners
  emitter.on('event', handler);
  emitter.on('event', num => t.true(num === 2 || num === 3));
  emitter.emit('event', 2);

  // remove one of the listeners by handler function
  emitter.off('event', handler);
  emitter.emit('event', 3);
});

test('removes all listeners by name', t => {
  t.plan(2);

  // create two listeners and emit
  emitter.on('event', () => t.pass());
  emitter.on('event', () => t.pass());
  emitter.emit('event');

  // remove all listeners and emit
  emitter.off('event');
  emitter.emit('event');
});

test('report listener counts by name', t => {
  // make handlers fail to ensure they are not called, since events are not emitted here
  emitter.on('event1', () => t.fail());
  emitter.on('event2', () => t.fail());
  emitter.on('event2', () => t.fail());

  t.deepEqual(emitter.listeners(), {
    event1: 1,
    event2: 2,
  });
});

test('report listener count by name', t => {
  // make handlers fail to ensure they are not called, since events are not emitted here
  emitter.on('event', () => t.fail());

  // check for the listener that was just created
  t.deepEqual(emitter.listeners('event'), { event: 1 });

  // check for listener that was not created
  t.deepEqual(emitter.listeners('no_event'), { no_event: 0 });
});

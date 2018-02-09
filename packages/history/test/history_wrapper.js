import test from 'tape';
import createWrapper from '../src/history_wrapper';

let wrapper;

test('before', t => {
  wrapper = createWrapper(window);
  t.pass('Setup complete');
  t.end();
});

test('wraps and unwraps default methods', t => {
  const methods = ['pushState', 'replaceState'];
  const cache = methods.reduce(
    (acc, method) => Object.assign(acc, { [method]: window.history[method] }),
    {}
  );

  // make sure the correct methods are cached
  methods.forEach(method => {
    t.is(typeof window.history[method], 'function', `history.${method} is a function`);
    t.is(cache[method], window.history[method], `${method} function is in the cache`);
  });

  // wrap replaces the native functions
  wrapper.wrap();
  methods.forEach(method => {
    t.is(typeof window.history[method], 'function');
    t.not(cache[method], window.history[method]);
  });

  // unwrap restores the original methods
  wrapper.unwrap();
  methods.forEach(method => {
    t.is(typeof window.history[method], 'function');
    t.is(cache[method], window.history[method]);
  });

  t.end();
});

test('fires onChange hander on state change', t => {
  t.plan(2);

  let callCount = 0;
  const args = [1, 2, 3];
  const onChange = stateArgs => {
    callCount += 1;

    t.deepEqual(stateArgs, args);

    // unwrap the window object when the tests are complete
    if (callCount === 2) wrapper.unwrap();
  };

  // wrap history with an onChange handler
  wrapper.wrap(onChange);

  // calling these methods should trigger the onChange handler
  window.history.pushState(...args);
  window.history.replaceState(...args);
});

test('after', t => {
  wrapper.unwrap();
  t.pass('Teardown Complete');
  t.end();
});

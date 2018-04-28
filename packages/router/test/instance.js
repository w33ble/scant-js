import test from 'tape';
import { noop } from '../src/utils';
import createRouter from '..';

test('throws if routes is not an array', t => {
  t.plan(1);
  const check = () => createRouter('hello world');
  t.throws(check, /An array of route objects is required/);
});

test('throws without any routes', t => {
  t.plan(1);
  const check = () => createRouter([{}]);
  t.throws(check, /Route definition is invalid: {}/);
});

test('throws on invalid path', t => {
  t.plan(1);
  t.throws(
    () => createRouter([{ path: 'not-valid-route', action: noop }]),
    /Route's path is invalid: not-valid-route/
  );
});

test('throws with duplicate names', t => {
  t.plan(1);
  // named routes must have unique names
  const routes = [
    { name: 'testroute', path: '/test1', action: () => {} },
    { name: 'testroute', path: '/test2', action: () => {} },
  ];
  t.throws(() => createRouter(routes), /Route with name 'testroute' already defined/);
});

test('passes with valid action', t => {
  t.plan(1);
  t.doesNotThrow(() => createRouter([{ path: '/test', action: noop }]));
});

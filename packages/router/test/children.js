import test from 'tape';
import { noop } from '../src/utils';
import createRouter from '..';

test('throws with duplicate names in children', t => {
  t.plan(1);
  // all route names must be unique, including child routes
  const routes = [
    { name: 'testroute', path: '/test1', action: noop },
    {
      path: '/test2',
      children: [{ name: 'testroute', path: '/child', action: noop }],
    },
  ];
  t.throws(() => createRouter(routes), /Route with name 'testroute' already defined/);
});

test('throws if invalid path on children', t => {
  t.plan(1);
  // all route names must be unique, including child routes
  const routes = [
    { path: '/test1', action: noop },
    {
      path: 'not-valid-route',
      children: [{ path: '/child', action: noop }],
    },
  ];
  t.throws(() => createRouter(routes), /Route's path is invalid: not-valid-route/);
});

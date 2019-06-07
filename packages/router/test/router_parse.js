const test = require('tape');
const createRouter = require('..');

test('parse returns a promise', t => {
  t.plan(3);

  const router = createRouter([{ path: '/test' }]);
  const p = router.parse('/test');

  t.equal(typeof p, 'object');
  t.equal(typeof p.then, 'function');
  p.then(() => t.pass('promise executed'));
});

test('parse rejects on no match', t => {
  t.plan(1);

  const router = createRouter([{ path: '/test' }]);
  const p = router.parse('/miss');

  p.then(() => p.fail('missing route should reject')).catch(err => {
    t.equal(err.message, 'No matching route found: /miss');
  });
});

test('parse rejects with invalid url', t => {
  t.plan(1);
  const routes = [{ path: '/test' }];
  const router = createRouter(routes);
  router.parse('not a route').catch(err => {
    t.equal(err.message, 'Failed to extract pathname: not a route');
  });
});

test('parse resolves params correctly', t => {
  t.plan(5);

  const routes = [{ path: '/path/:with/:params' }];
  const router = createRouter(routes);

  // test param values
  Promise.resolve()
    .then(() =>
      router.parse('/path/to/winning').then(matched => {
        t.deepEqual(matched.match, { path: routes[0].path, name: routes[0].name, meta: {} });
        t.deepEqual(matched.params, { with: 'to', params: 'winning' });
      })
    )
    .then(() =>
      router.parse('/path/100/3.14159').then(matched => {
        // test casting number params to float
        t.deepEqual(matched.match, { path: routes[0].path, name: routes[0].name, meta: {} });
        t.notDeepEqual(matched.params, { with: '100', params: '3.14159' });
        t.deepEqual(matched.params, { with: 100, params: 3.14159 });
      })
    )
    .catch(err => t.fail(err));
});

test('parse calls matching route action', t => {
  t.plan(3);
  const handler = ({ match, params, location }) => {
    // test items passed to action
    t.deepEqual(match, { path: '/path/:with/:params', name: undefined, meta: {} });
    t.deepEqual(params, { with: 'to', params: 'winning' });
    t.equal(location.pathname, '/path/to/winning');
  };

  const routes = [{ path: '/path/:with/:params', action: handler }];
  const router = createRouter(routes);

  // execute route to call the action function
  router.parse('/path/to/winning');
});

test('parse rejects if action rejects', t => {
  t.plan(1);
  const handler = () => Promise.reject(new Error('i failed'));
  const router = createRouter([{ path: '/reject', action: handler }]);

  // execute route to call the action function
  router
    .parse('/reject')
    .then(() => t.fail('rejected action should cause parse rejection'))
    .catch(err => {
      t.equal(err.message, 'i failed');
    });
});

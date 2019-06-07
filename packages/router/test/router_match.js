const test = require('tape');
const createRouter = require('..');

test('router api', t => {
  t.plan(1);
  const routes = [{ path: '/test' }];
  const router = createRouter(routes);
  t.true(typeof router.match === 'function');
});

test('match throws with invalid url', t => {
  t.plan(1);
  const routes = [{ path: '/test' }];
  const router = createRouter(routes);
  t.throws(() => router.match('not a route'), /Failed to extract pathname: not a route/);
});

test('match resolves routes', t => {
  t.plan(7);

  let match;
  const routes = [
    { path: '/test' },
    { path: '/test2', name: 'test2' },
    { path: '/path/:with/:params' },
    { path: '/path2/:with/:params', name: 'path2' },
  ];
  const router = createRouter(routes);

  // test non-matching route
  t.false(router.match('/hello/world'));

  // test simple routes, checking name property
  match = router.match('/test');
  t.equal(match.path, routes[0].path);

  match = router.match('/test2');
  t.equal(match.path, routes[1].path);
  t.equal(match.name, routes[1].name);

  // test param route
  match = router.match('/path/to/winning');
  t.equal(match.path, routes[2].path);

  match = router.match('/path2/all/green');
  t.equal(match.path, routes[3].path);
  t.equal(match.name, routes[3].name);
});

test('match resolves child routes', t => {
  t.plan(4);

  let match;
  const routes = [
    {
      path: '/test',
      children: [
        {
          path: '/one',
          name: 'firsttestone',
        },
      ],
    },
    {
      path: '/test2',
      children: [
        {
          path: '/two',
          children: [{ name: 'deepchild', path: '/' }],
        },
      ],
    },
  ];
  const router = createRouter(routes);

  match = router.match('/test/one');
  t.equal(match.path, '/test/one');
  t.equal(match.name, 'firsttestone');

  match = router.match('/test2/two');
  t.equal(match.path, '/test2/two');
  t.equal(match.name, 'deepchild');
});

test('match should only contain certain properties', t => {
  t.plan(1);

  const route = {
    path: '/test/:with/:params',
    name: 'paramstest',
    meta: { some: 'object' },
  };
  const router = createRouter([route]);

  t.deepEqual(router.match('/test/one/two'), route);
});

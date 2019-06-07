const test = require('tape');
const createRouter = require('..');

test('router api', t => {
  t.plan(1);
  const routes = [{ path: '/test' }];
  const router = createRouter(routes);
  t.true(typeof router.create === 'function');
});

test('create should be false', t => {
  t.plan(2);
  const routes = [
    { path: '/test', name: 'test', action: () => {} },
    { path: '/path/:with/:params', name: 'path', action: () => {} },
  ];
  const router = createRouter(routes);

  // returns false with missing or ivnalid name
  t.false(router.create());
  t.false(router.create('nope'));
});

test('create should throw with missing params', t => {
  t.plan(5);
  const routes = [
    { path: '/test', name: 'test', action: () => {} },
    { path: '/path/:with/:params', name: 'path', action: () => {} },
  ];
  const router = createRouter(routes);

  // should throw unless given all route params
  const errMsg = /Route can not be created/;
  t.throws(() => router.create('path'), errMsg);
  t.throws(() => router.create('path', {}), errMsg);
  t.throws(() => router.create('path', { with: 'hotsauce' }), errMsg);
  t.throws(() => router.create('path', { params: 'cheese' }), errMsg);
  t.doesNotThrow(() => router.create('path', { with: 'hotsauce', params: 'cheese' }));
});

test('create should return constructed route', t => {
  t.plan(2);

  const routes = [
    { path: '/test', name: 'test', action: () => {} },
    { path: '/path/:with/:params', name: 'path', action: () => {} },
  ];
  const router = createRouter(routes);

  // should create routes with and without params
  t.is(router.create('test'), '/test');
  t.is(router.create('path', { with: 1, params: 'two' }), '/path/1/two');
});

test('create should pass through slash routes', t => {
  t.plan(1);
  const router = createRouter([{ path: '/test' }]);
  t.is(router.create('/test/route'), '/test/route');
});

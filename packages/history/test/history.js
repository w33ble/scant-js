import test from 'tape';
import createHistory from '../src/index';

const create = (onChange, options) => createHistory(window, onChange, options);

test('throws without root object', t => {
  t.plan(1);

  try {
    createHistory();
  } catch (err) {
    t.is(err.message, 'History creator requires the window object');
  }
});

test('throws without onChange handler', t => {
  t.plan(1);

  try {
    create();
  } catch (err) {
    t.is(err.message, 'You must provide an onChange function');
  }
});

test('location includes a type', t => {
  const history = create(() => {});
  t.is(history.location().type, 'location');
  t.end();
});

test('triggers onChange when started', t => {
  t.plan(2);

  const history = create(([location]) => {
    // check the location type for custom pushstate name
    t.is(location.type, 'pushstate');
  });

  history.start();

  // history wraps the native history methods, so use them directly
  window.history.replaceState({}, '', '?q=params');
  window.history.pushState({}, '', '#check-hash');

  history.stop();
});

test('triggers onChange for popstate events', t => {
  t.plan(4);

  let count = 0;

  const historyEvents = [
    // history wraps the native history methods, so use them directly
    // create some history items using pushState
    () => window.history.pushState({}, '', '?q=money+ball'),
    () => window.history.pushState({}, '', '?q=fight+club'),
    // use back/forward to trigger popstate event
    () => window.history.back(),
    () => window.history.forward(),
  ];

  const history = create(([location]) => {
    count += 1;

    // first 2 events are pushstate, the last 2 are popstate
    const type = count < 3 ? 'pushstate' : 'popstate';

    // check the location type for custom pushstate name
    t.is(location.type, type, `location type is ${type}`);

    // 3rd event is the back event, trigger the forward event
    // if (count === 3) window.history.forward();

    if (count === 4) {
      // stop the history listener after the last event
      history.stop();
    } else {
      // fire the next event
      historyEvents[count]();
    }
  });

  // start watching for browser history changes
  history.start();

  // start the chain of history events
  historyEvents[0]();
});

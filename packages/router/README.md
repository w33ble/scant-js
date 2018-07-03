# @scant/router

Dead simple router.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/scant-js/master/LICENSE)
[![npm](https://img.shields.io/npm/v/@scant/router.svg)](https://www.npmjs.com/package/@scant/router)
![size](http://img.badgesize.io/https://unpkg.com/@scant/router?compression=gzip&label=minzip_size)

## Install

```
yarn add @scant/router
```

## Usage

This package is basically a wrapper around simple path matching. It currently uses [url-pattern](https://github.com/snd/url-pattern) to handle matching. It allows you to define routes as an array of objects, with nesting, naming, and a handler function. You can also optionally attach metadata to the route defintion, which will be available in the route handlers or when finding the matching route for a url.

This package **does not** watch or modify the page location. It's meant to be used with something that can observe changes to `window.history`. Consider using with something like [@scant/history](https://github.com/w33ble/scant-js/tree/master/packages/history) or [history](https://github.com/ReactTraining/history).

Every route must have a `path` property. Each route can optionally have a `name` property, which can be used to turn a parameter object into a url. For the path, trailing slashes are not required. See [url-pattern](https://github.com/snd/url-pattern) to learn how the pattern matching works. Additionally, a route can contain a `meta` property, as well as an `action` or a `children` property.

```js
import createRouter from '@scant/router';
const routes = [
  {
    name: 'home',
    path: '/',
    action: () => document.querySelector('body').textContent = 'Home';
  },
  {
    name: 'welcome',
    path: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/', // will match /welcome
        action: ({ match }) => {
          document.querySelector('body').textContent = `Welcome ${match.meta.name}`;
        },
        meta: {
          name: 'User'
        },
      },
      {
        name: 'welcomeName',
        path: '/:name', // will match /welcome/:name
        action: ({ param }) => {
          document.querySelector('body').textContent = `Welcome ${params.name}`;
        }
      }
    ]
  },
  {
    name: 'matcher'
    path: '/match/:some/:params',
    meta: {
      anthing: 'goes in this object',
    },
  },
];

const router = createRouter(routes);
```

### Methods

- `router.match(url)`: Given a url, will return the route definition that matches it, or `false`.
- `router.parse(url)`: Given a url, will return the matching route's payload (see below), or `false`.
- `router.create(name, params)`: Given a route's name, and any dynamic params, will return the generated url, or false of no matching route name exists. Will throw if you do not provide a `params` object with all the required route params.

### Action

The action is the route handler function, and it receives a `payload` object consisting of the following:

- `url`: The url being checked.
- `match`: The matched route definition object. It will include the `name`, full `path`, and any `meta` data. If the matching route is part of nested `children`, the `path` will be the entire constructed path (ex. `/welcome/:name` in the `welcomeName` route above).
- `params`: An object of the parsed params from the route (ex. `{ name: ... }` in the `welcomeName` route above).
- `router`: The router instance, useful if you've extended the instance.

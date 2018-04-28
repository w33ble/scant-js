import UrlPattern from 'url-pattern';
import { isType, hasKey, startsWithSlash, noop } from './utils';

// path format helpers
const isValidRouteConfig = conf => {
  if (!isType('object', conf)) return false;
  const validAction = isType('unset', conf.action) || isType('function', conf.action);
  const validChildren = isType('unset', conf.children) || isType('array', conf.children);
  const validMeta = isType('unset', conf.meta) || isType('object', conf.meta);
  return hasKey(conf, 'path') && validAction && validChildren && validMeta;
};

// takes a path (leading /), appends to another path, and returns it without the trailing /
const getPath = (path, appendTo = '') => {
  if (!startsWithSlash(path)) return false;
  const newPath = `${appendTo.replace(/\/$/, '')}${path}`;
  return newPath.length > 1 ? newPath.replace(/\/$/, '') : newPath;
};

const parseUrl = path => {
  const parts = path.match(/^(\/[^?#\s]*)(\?[^#\s]*)?(#[^\s]*)?$/);
  if (!parts) throw new Error(`Failed to extract pathname: ${path}`);
  return {
    url: parts[0],
    pathname: parts[1],
    search: parts[2],
    hash: parts[3],
  };
};

const getMatchedObject = matched => ({
  path: matched.path,
  name: matched.name,
  meta: matched.meta,
});

// given a route object and optional parent path, create an array of route configs
function parseRoute(route, path = '') {
  if (!isValidRouteConfig(route)) {
    throw new Error(`Route definition is invalid: ${JSON.stringify(route)}`);
  }

  const fullPath = getPath(route.path, path);
  if (fullPath === false) throw new Error(`Route's path is invalid: ${route.path}`);

  // if children is defined, recurse into child definitions, appending parent paths
  if (isType('array', route.children)) {
    return route.children.reduce(
      (routesAcc, childRoute) => routesAcc.concat(parseRoute(childRoute, fullPath)),
      []
    );
  }

  return [
    {
      name: route.name,
      path: fullPath,
      meta: route.meta || {},
      action: route.action || noop,
      parser: new UrlPattern(fullPath, {
        segmentNameCharset: 'a-zA-Z0-9_-',
        segmentValueCharset: 'a-zA-Z0-9-_~ %.',
      }),
    },
  ];
}

export default function createRouter(routes, opts = {}) {
  if (!isType('array', routes)) throw new Error('An array of route objects is required');

  // internal options
  const options = {
    hashChar: opts.useHash ? '#' : opts.useHashBang ? '#!' : '', // eslint-disable-line no-nested-ternary
    basepath: startsWithSlash(opts.basepath) ? getPath(opts.basepath) : '',
  };

  // used to track all route definitions
  const routeConfigs = { configs: [], parsers: [], names: [] };

  // used to build the routeConfigs object
  function addRoute(route) {
    // parse route definition into flattened collection of routes (children included)
    const parsedRoutes = parseRoute(route);

    // add all of the parsed routes to the main routeConfig
    parsedRoutes.forEach(({ parser, ...routeConfig }) => {
      if (routeConfig.name != null && routeConfigs.names.includes(routeConfig.name)) {
        throw new Error(
          `Route with name '${routeConfig.name}' already defined, names must be unique`
        );
      }

      routeConfigs.parsers.push(parser);
      routeConfigs.configs.push(routeConfig);
      routeConfigs.names.push(routeConfig.name);
    });
  }

  // given a url, return params, matching index, and config, or false of no match
  function getRoute(url) {
    return routeConfigs.parsers.reduce((acc, parser, index) => {
      // short-circuit if there's already a match
      if (acc !== false) return acc;

      const params = parser.match(url);
      if (params) return { ...routeConfigs.configs[index], params, index };
      return acc;
    }, false);
  }

  // load any initial routes
  routes.forEach(addRoute);

  return {
    // given a URL, check the route collection for a match
    match(url) {
      const location = parseUrl(url);
      const matched = getRoute(location.pathname);

      // no match, nothing left to do
      if (matched === false) return false;

      // return the matched definition object
      return getMatchedObject(matched);
    },

    // given a URL, check routes collection, parse params & execute the action of match
    async parse(url) {
      const location = parseUrl(url);
      const matched = getRoute(location.pathname);

      // no match, nothing left to do
      if (matched === false) throw new Error(`No matching route found: ${url}`);

      // cast any number values to numbers, mutation is ok, this is our own object
      Object.keys(matched.params).forEach(key => {
        const numberVal = parseFloat(matched.params[key]);
        if (!Number.isNaN(numberVal)) matched.params[key] = numberVal;
      });

      const payload = {
        location,
        params: matched.params,
        match: getMatchedObject(matched),
        router: this,
      };

      await matched.action(payload);
      return payload;
    },

    // given a name and optional params, generate a URL from the routes collection
    create(name, params = {}) {
      // only create routes from existing named routes
      if (name == null) return false;

      // given a name with a slash, it's a url, use it directly
      if (startsWithSlash(name)) return `${options.hashChar}${options.basepath}${name}`;

      // check that the passed name exists
      if (!routeConfigs.names.includes(name)) return false;

      // build and return the route given using provided params
      const routeIndex = routeConfigs.configs.findIndex(config => config.name === name);

      try {
        // throws when a route can not be built
        const route = routeConfigs.parsers[routeIndex].stringify(params);
        return `${options.hashChar}${options.basepath}${route}`;
      } catch (e) {
        // add a little more context to the thrown errors
        e.message = `Route can not be created, ${e.message}`;
        throw e;
      }
    },
  };
}

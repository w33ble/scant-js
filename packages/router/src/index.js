import Path from 'url-pattern';
import { isObjectLike, hasKey, startsWithSlash } from './utils';

// path format helpers
const isValidRouteConfig = conf => {
  if (!isObjectLike(conf)) return false;
  const validProps = hasKey(conf, 'action') || hasKey(conf, 'children');
  const validAction = !conf.action || typeof conf.action === 'function';
  const validMeta = typeof conf.meta === 'undefined' || isObjectLike(conf.meta);
  return hasKey(conf, 'path') && validProps && validAction && validMeta;
};

const getPath = (path, appendTo = '') => {
  if (!startsWithSlash(path)) return false;
  const newPath = `${appendTo.replace(/\/$/, '')}${path}`;
  return newPath.length > 1 ? newPath.replace(/\/$/, '') : newPath;
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
  if (Array.isArray(route.children)) {
    return route.children.reduce(
      (routesAcc, childRoute) => routesAcc.concat(parseRoute(childRoute, fullPath)),
      []
    );
  }

  return [
    {
      path: fullPath,
      action: route.action,
      name: route.name,
      meta: route.meta || {},
      parser: new Path(fullPath),
    },
  ];
}

export default function createRouter(routes, opts = {}) {
  if (!Array.isArray(routes)) throw new Error('An array of route objects is required');

  const options = {
    hashChar: opts.useHash ? '#' : opts.useHashBang ? '#!' : '', // eslint-disable-line no-nested-ternary
    basepath: startsWithSlash(opts.basepath) ? getPath(opts.basepath) : '',
  };

  const routeConfigs = { configs: [], parsers: [], names: [] };

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

  function getRoute(url) {
    const index = routeConfigs.parsers.findIndex(parser => parser.match(url));
    return index < 0 ? false : { ...routeConfigs.configs[index], index };
  }

  // load any initial routes
  routes.forEach(addRoute);

  return {
    // given a URL, check the route collection for a match
    match(url) {
      const matched = getRoute(url);

      // no match, nothing left to do
      if (matched === false) return false;

      // return the matched definition object
      return getMatchedObject(matched);
    },

    // given a URL, check routes collection, parse params & execute the action of match
    parse(url) {
      const matched = getRoute(url);

      // no match, nothing left to do
      if (matched === false) return false;

      // parse params and call the route handler
      const params = routeConfigs.parsers[matched.index].match(url);

      // cast any number values to numbers
      Object.keys(params).forEach(key => {
        const numberVal = Number.parseFloat(params[key]);
        if (!Number.isNaN(numberVal)) params[key] = numberVal;
      });

      const payload = {
        url,
        params,
        match: getMatchedObject(matched),
        router: this,
      };

      return Promise.resolve(matched.action(payload)).then(() => payload);
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

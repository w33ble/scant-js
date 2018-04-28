/* istanbul ignore file */
export const isType = (type, val) => {
  if (type === 'object') return typeof val === 'object' && val != null && !Array.isArray(val);
  if (type === 'array') return Array.isArray(val);
  if (type === 'null') return val === null;
  if (type === 'unset') return val == null;
  const valType = typeof val;
  return valType === type;
};

export const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const startsWithSlash = path => /^\//.test(path);

export const noop = () => {};

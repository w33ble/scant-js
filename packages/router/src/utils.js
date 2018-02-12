export const isObjectLike = val => typeof val === 'object' && val != null && !Array.isArray(val);

export const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const startsWithSlash = path => /^\//.test(path);

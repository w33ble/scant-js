const Bili = require('bili');

module.exports = function buildHelper(opts = {}) {
  const { write, ...options } = opts;
  if (write === false) return Bili.generate(options);
  return Bili.write(options);
};

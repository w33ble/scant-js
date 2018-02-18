import Bili from 'bili';

export default function(opts = {}) {
  const { write, ...options } = opts;
  if (write === false) return Bili.generate(options);
  return Bili.write(options);
}

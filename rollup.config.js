import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const libraryName = 'ro-filter-parser';
export default {
  input: `lib/${libraryName}.js`,
  output: [
    {
      file: pkg.main,
      name: 'RoFilterParser',
      format: 'umd',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: false,
    }),
    resolve({
      mainFields: ['module', 'main'],
      preferBuiltins: false,
    }),
  ],
};

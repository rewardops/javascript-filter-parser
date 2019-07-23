import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const libraryName = 'ro-filter-parser';
export default {
  input: `src/${libraryName}.js`,
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
    // commonjs({
    //   namedExports: {
    //     // left-hand side can be an absolute path, a path
    //     // relative to the current directory, or the name
    //     // of a module in node_modules
    //     // 'node_modules/ramda/src/flatten.js': ['flatten'],
    //     // 'node_modules/ramda/src/mergeDeepRight.js': ['mergeDeepRight'],
    //     'node_modules/ramda/dist/ramda.js': ['ramda'],
    //   },
    // }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: false,
    }),
    resolve({
      jsnext: true,
      browser: true,
      main: true,
      preferBuiltins: false,
    }),
  ],
};

import commonjs from 'rollup-plugin-commonjs';

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
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/ramda/index.js': ['ramda'],
      },
    }),
  ],
};

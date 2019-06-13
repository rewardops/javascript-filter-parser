const pkg = require('./package.json');
const libraryName = 'ro-filter-parser';
export default {
  input: `src/${libraryName}.js`,
  output: [
    { file: pkg.main, name: 'RoFilterParser', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
};

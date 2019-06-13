(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.RoFilterParser = {}));
}(this, function (exports) { 'use strict';

  const nearley = require('nearley');
  const grammar = require('./compiled-grammar/ro');

  function parseFilterString(input) {
    // Create a Parser object from our grammar.
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);

    const results = parser.results;
    if (results.length !== 1) return 'Ambigous grammar. Bad!';

    return results[0];
  }

  exports.parseFilterString = parseFilterString;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ro-filter-parser.umd.js.map

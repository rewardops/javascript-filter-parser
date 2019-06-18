const nearley = require('nearley');
const grammar = require('./compiled-grammar/main');

/**
 * The main function of the library. Parses the filter string to return a JSON object
 *
 * @export
 * @param {string} input - the filter string
 * @returns {object} - a json representation of the string
 */
function parseFilterString(input) {
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(input);

  const results = parser.results;
  if (results.length > 1) return 'Ambigous grammar. Bad!';
  if (results.length === 0) return 'Empty result. Weird!';

  return results[0];
}

export { parseFilterString };
//# sourceMappingURL=ro-filter-parser.esm.js.map

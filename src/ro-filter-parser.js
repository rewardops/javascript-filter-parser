const nearley = require('nearley');
const grammar = require('./compiled-grammar/main');

export function parseFilterString(input) {
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(input);

  const results = parser.results;
  if (results.length !== 1) return 'Ambigous grammar. Bad!';

  return results[0];
}

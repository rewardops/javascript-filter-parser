const nearley = require('nearley');
const grammar = require('../src/compiled-grammar/main');

/**
 * The main function of the library. Parses the filter string to return a JSON object
 *
 * @export
 * @param {string} input - the filter string
 * @returns {object} - a json representation of the string
 */
export function parseFilterString(input) {
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(input);

  const results = parser.results;
  if (results.length > 1) return 'Ambigous grammar. Bad!';
  if (results.length === 0) return 'Empty result. Weird!';

  return results[0];
}

/**
 * This takes in the array of category objects returned by the main parser and converts it into a format which is easier to consume.
 *
 * @export
 * @param {Array} categoryArray - an array of the form:
 * [
 *  {subcategory: true, included: ['abc']}
 * ]
 * @returns {object} - a parsed object of the form:
 * {
 *  includedWithSubcategories: ['abc'],
 *  excludedWithSubcategories: [],
 *  includedWithoutSubcategories: [],
 *  excludedWithoutSubCategories: [],
 * }
 */
export function simplifyCategory(categoryArray) {
  return categoryArray.reduce((resultObject, cat) => {
    if (cat.subcategory) {
      if (cat.included) {
        resultObject.includedWithSubcategories = cat.included;
      }
      if (cat.excluded) {
        resultObject.excludedWithSubcategories = cat.excluded;
      }
    } else {
      if (cat.included) {
        resultObject.includedWithoutSubcategories = cat.included;
      }
      if (cat.excluded) {
        resultObject.excludedWithoutSubcategories = cat.excluded;
      }
    }
    return resultObject;
  }, {});
}

export function addToFilter(definition, newFilter) {
  
}

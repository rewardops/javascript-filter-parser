const nearley = require('nearley');
const grammar = require('../src/compiled-grammar/main');
import { setCategoryCodes, addCategoryCodes } from './util/category';

/**
 * The main function of the library. Parses the filter string to return a JSON object
 *
 * @export
 * @param {string} filterString - the filter string
 * @returns {object} - a json representation of the string
 */
export function parseFilterString(filterString) {
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(filterString);

  const results = parser.results;
  if (results.length > 1) return 'Ambigous grammar. Bad!';
  if (results.length === 0) return 'Empty result. Weird!';

  return results[0];
}

export function addToFilter(definition, { label, subtype, values }) {
  const parsedFilter = parseFilterString(definition);
  switch (label) {
    case 'CATEGORY':
      parsedFilter[0].CATEGORY = addCategoryCodes(parsedFilter[0].CATEGORY, subtype, values);
      break;

    default:
      break;
  }
  return convertObjectToString(parsedFilter);
}

export function setFilter(definition, { label, subtype, values }) {
  const parsedFilter = parseFilterString(definition);
  switch (label) {
    case 'CATEGORY':
      parsedFilter[0].CATEGORY = setCategoryCodes(subtype, values);
      break;

    default:
      break;
  }
  return convertObjectToString(parsedFilter);
}

function convertObjectToString(filter) {
  if (filter.constructor === Array) {
    return filter.reduce((str, f) => {
      if (str === '') {
        return `(${convertObjectToString(f)})`;
      } else {
        return `(${str.substring(1, str.length - 1)}|${convertObjectToString(f)})`;
      }
    }, '');
  }
  if (filter.constructor === Object) {
    if (filter.CATEGORY) {
      const { CATEGORY } = filter;
      return Object.keys(CATEGORY)
        .map(key => {
          const equalOp = key.includes('include') ? '==' : '!=';
          const subcategoryOp = key.includes('Without') ? 'false' : 'true';
          const values = CATEGORY[key].map(value => `"${value}"`).join(',');
          return `CATEGORY(${subcategoryOp})${equalOp}[${values}]`;
        })
        .join('&');
    }
    if (filter.SIV_ATTRIBUTE) {
      const { id } = filter.SIV_ATTRIBUTE;
      return Object.keys(id).map(key => {
        const equalOp = key.includes('include') ? '==' : '!=';
        const values = id[key].map(value => `${value}`).join(',');
        return `SIV_ATTRIBUTE(id)${equalOp}[${values}]`;
      });
    }
  }
}

const nearley = require('nearley');
const grammar = require('../src/compiled-grammar/main');

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

function convertObjectToString(filter) {
  if (filter.constructor === Array) {
    return filter.reduce((str, f) => {
      if (str === '') {
        return `(${convertObjectToString(f)})`;
      } else {
        return `(${string.substring(1, string.length - 1)}|${convertObjectToString(f)})`;
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
  }
}

function setFilter(definition, { label, subtype, values }) {
  const parsedFilter = parseFilterString(definition);
  switch (label) {
    case 'CATEGORY':
      parsedFilter[0].category = setCategory(subtype, values);
      break;

    default:
      break;
  }
}

function setCategory(subtype, values) {
  let updatedCat = {};
  if (subtype === 'subcategory-included') {
    return (updatedCat.includedWithSubcategories = [...values]);
  }
}

const categoryTypes = [
  'includedWithSubcategories',
  'includedWithoutSubcategories',
  'excludedWithSubcategories',
  'excludedWithoutSubcategories',
];
function addCategoryCodes(categoryObject, subtype, values) {
  // If the value already exists anywhere in categories, remove it
  categoryTypes.forEach(type => {
    if (categoryObject[type]) {
      categoryObject[type] = categoryObject[type].filter(value => !values.includes(value));
    }
  });
  if (subtype === 'subcategory-included') {
    const currentValues = categoryObject.includedWithSubcategories || [];
    categoryObject.includedWithSubcategories = Array.from(new Set([...currentValues, ...values]));
  }
  if (subtype === 'subcategory-excluded') {
    const currentValues = categoryObject.includedWithoutSubcategories || [];
    categoryObject.includedWithoutSubcategories = Array.from(new Set([...currentValues, ...values]));
  }
  return categoryObject;
}

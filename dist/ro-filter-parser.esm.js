import { flatten, mergeDeepRight } from 'ramda';

/* eslint-disable no-param-reassign */
const categoryTypes = [
  'includedWithSubcategories',
  'includedWithoutSubcategories',
  'excludedWithSubcategories',
  'excludedWithoutSubcategories',
];

function setCategoryCodes(subtype, values) {
  const updatedCat = {};
  if (subtype === 'subcategory-included') {
    updatedCat.includedWithSubcategories = [...values];
  }
  if (subtype === 'subcategory-excluded') {
    updatedCat.includedWithoutSubcategories = [...values];
  }
  return updatedCat;
}

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

// Coz flatMap seems to be implemented only in Node11

function convertObjectToString(filter) {
  if (filter.constructor === Array) {
    return filter.map(f => `${convertObjectToString(f)}`).join('|');
  }
  if (filter.constructor === Object) {
    const filterArray = [];
    if (filter.SIV_ATTRIBUTE) {
      const filterStringArray = flatten(
        Object.keys(filter.SIV_ATTRIBUTE).map(type =>
          Object.keys(filter.SIV_ATTRIBUTE[type]).map(subtype => {
            const equalOp = subtype.includes('include') ? '==' : '!=';
            const values = filter.SIV_ATTRIBUTE[type][subtype].map(value => `${value}`).join(',');
            return `SIV_ATTRIBUTE(${type})${equalOp}[${values}]`;
          })
        )
      );

      filterArray.push(...filterStringArray);
    }
    if (filter.CATEGORY) {
      const { CATEGORY } = filter;
      const filterStringArray = Object.keys(CATEGORY).map(key => {
        const equalOp = key.includes('include') ? '==' : '!=';
        const subcategoryOp = key.includes('Without') ? 'false' : 'true';
        const values = CATEGORY[key].map(value => `"${value}"`).join(',');
        return `CATEGORY(${subcategoryOp})${equalOp}[${values}]`;
      });
      filterArray.push(filterStringArray);
    }
    if (filter.array) {
      filterArray.push(convertObjectToString(filter.array));
    }
    return filterArray.length > 1 ? `(${filterArray.join('&')})` : filterArray.join('&');
  }
  return '';
}

function getObjectIndex(filterArray) {
  let result;
  filterArray.forEach((f, i) => {
    if (JSON.stringify(f) !== '{}') {
      result = i;
    }
  });
  return result;
}

/* eslint-disable no-param-reassign */
function setSivValues(parsedFilter, sivIncluded, subtype, values) {
  let includedIds = sivIncluded ? sivIncluded.SIV_ATTRIBUTE.id.included : [];
  if (subtype === 'id-included') {
    includedIds = values;
    // Rewrite this so that we don't need param reassign
    parsedFilter.forEach((f, index) => {
      if (
        parsedFilter[index].SIV_ATTRIBUTE
        && parsedFilter[index].SIV_ATTRIBUTE.id
        && parsedFilter[index].SIV_ATTRIBUTE.id.excluded
      ) {
        parsedFilter[index].SIV_ATTRIBUTE.id.excluded = parsedFilter[index].SIV_ATTRIBUTE.id.excluded.filter(
          id => !values.includes(id),
        );
      }
      // If all the included values are filtered out, delete SIV_ATTRIBUTE key
      if (
        parsedFilter[index].SIV_ATTRIBUTE
        && parsedFilter[index].SIV_ATTRIBUTE.id
        && parsedFilter[index].SIV_ATTRIBUTE.id.excluded
        && parsedFilter[index].SIV_ATTRIBUTE.id.excluded.length === 0
      ) {
        delete parsedFilter[index].SIV_ATTRIBUTE.id;
      }
    });
  }
  if (subtype === 'id-excluded') {
    let updated = false;
    if (sivIncluded) {
      includedIds = includedIds.filter(id => !values.includes(id));
    }
    parsedFilter.forEach((f, index) => {
      if (
        parsedFilter[index].SIV_ATTRIBUTE
        && parsedFilter[index].SIV_ATTRIBUTE.id
        && parsedFilter[index].SIV_ATTRIBUTE.id.excluded
      ) {
        parsedFilter[index].SIV_ATTRIBUTE.id.excluded = values;
        updated = true;
      }
    });
    if (!updated) {
      const index = getObjectIndex(parsedFilter);
      parsedFilter[index] = mergeDeepRight(parsedFilter[index], { SIV_ATTRIBUTE: { id: { excluded: values } } });
    }
  }
  if (subtype === 'supplier-included') {
    const index = getObjectIndex(parsedFilter);
    parsedFilter[index] = mergeDeepRight(parsedFilter[index], { SIV_ATTRIBUTE: { supplier: { included: values } } });
  }
  const updatedSivIncluded = includedIds.length ? { SIV_ATTRIBUTE: { id: { included: includedIds } } } : null;
  return { parsedFilter, updatedSivIncluded };
}

/**
 * This is used to remove any empty objects going through it recursively
 *
 * @export
 * @param {Object} obj
 * @returns {Object}
 *
 * @example
  const test = {
    SIV: {
      id: {},
      incl: [1]
    },
    SIV2: {
      id: {
        included: {}
      }
    }
  }

  cleanObject(test)
  Output: { SIV: { incl: [ 1 ] } }
 */
function cleanObject(obj) {
  const resultObject = {};
  Object.keys(obj).forEach(key => {
    if (obj[key].constructor === Object) {
      resultObject[key] = cleanObject(obj[key]);
      if (JSON.stringify(resultObject[key]) === '{}') {
        delete resultObject[key];
      }
    } else {
      resultObject[key] = obj[key];
    }
  });
  return resultObject;
}

function extractSivIncluded(parsedFilter, sivIncluded) {
  let updatedSivIncluded = sivIncluded;
  const updatedFilter = parsedFilter.map(filter => {
    if (filter.SIV_ATTRIBUTE && filter.SIV_ATTRIBUTE.id.included) {
      if (updatedSivIncluded) {
        updatedSivIncluded.SIV_ATTRIBUTE.id.included.push(...filter.SIV_ATTRIBUTE.id.included);
      } else {
        updatedSivIncluded = {
          SIV_ATTRIBUTE: {
            id: {
              included: filter.SIV_ATTRIBUTE.id.included,
            },
          },
        };
      }
      delete filter.SIV_ATTRIBUTE.id.included;
    }
    if (filter.array) {
      ({ updatedFilter: filter.array, updatedSivIncluded } = extractSivIncluded(filter.array, updatedSivIncluded));
      // This is being done only because of the way the current filter definitions are set up where they are wrongly grouped based on the OR.
      // Basically all the current definitions have been slightly wrong but because they were never grouped with anything else, it was not noticable.
      filter.array.forEach(f => {
        if (f.CATEGORY) {
          filter.CATEGORY = f.CATEGORY;
        }
        delete f.CATEGORY;
      });
    }
    return filter;
  });
  return { updatedFilter, updatedSivIncluded };
}

const nearley = require('nearley');
const grammar = require('../src/compiled-grammar/main');

/**
 * The main function of the library. Parses the filter string to return a JSON object
 *
 * @export
 * @param {string} filterString - the filter string
 * @returns {object} - a json representation of the string
 */
function parseFilterString(filterString) {
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(filterString);

  const { results } = parser;
  if (results.length > 1) return 'Ambigous grammar. Bad!';
  if (results.length === 0) return 'Empty result. Weird!';

  return results[0];
}

function addToFilter(definition, { label, subtype, values }) {
  const parsedFilter = parseFilterString(definition);
  switch (label) {
    case 'CATEGORY':
      parsedFilter.forEach((filter, index) => {
        if (parsedFilter[index].CATEGORY) {
          parsedFilter[index].CATEGORY = addCategoryCodes(filter.CATEGORY, subtype, values);
        }
      });
      break;

    default:
      break;
  }
  return convertObjectToString(parsedFilter);
}

function setFilter(definition, { label, subtype, values }) {
  let parsedFilter = parseFilterString(definition);

  // SIV ATTRIBUTE Included is a special case where if the value is included that is "ORed" to all the other rules.
  // So we extract it out
  let sivIncluded;
  ({ updatedSivIncluded: sivIncluded, updatedFilter: parsedFilter } = extractSivIncluded(parsedFilter, sivIncluded));

  parsedFilter.forEach((filter, index) => {
    if (parsedFilter[index].array) {
      const cleanArray = parsedFilter[index].array.map(f => cleanObject(f)).filter(f => JSON.stringify(f) !== '{}');
      if (cleanArray.length) {
        parsedFilter[index].array = cleanArray;
      } else {
        delete parsedFilter[index].array;
      }
    }
  });

  switch (label) {
    case 'CATEGORY': {
      let updated = false;
      parsedFilter.forEach((filter, index) => {
        if (parsedFilter[index].CATEGORY) {
          parsedFilter[index].CATEGORY = setCategoryCodes(subtype, values);
          updated = true;
        }
      });
      if (!updated) {
        const CATEGORY = setCategoryCodes(subtype, values);
        parsedFilter[0].CATEGORY = CATEGORY;
      }
      break;
    }
    case 'SIV': {
      ({ updatedSivIncluded: sivIncluded, parsedFilter } = setSivValues(parsedFilter, sivIncluded, subtype, values));
      break;
    }

    default:
      break;
  }

  // Remove any empty objects (maybe caused by the SIV extraction)
  parsedFilter.forEach((filter, index) => {
    parsedFilter[index] = cleanObject(parsedFilter[index]);
  });
  parsedFilter = parsedFilter.filter(filter => JSON.stringify(filter) !== '{}');
  if (sivIncluded && parsedFilter.length) {
    parsedFilter.push(sivIncluded);
  }
  const convertedFilter = parsedFilter.length ? parsedFilter : sivIncluded;
  return convertObjectToString(convertedFilter);
}

export { addToFilter, parseFilterString, setFilter };
//# sourceMappingURL=ro-filter-parser.esm.js.map

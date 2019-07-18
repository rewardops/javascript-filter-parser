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
const concat = (x, y) => x.concat(y);

function convertObjectToString(filter) {
  if (filter.constructor === Array) {
    return filter.reduce((str, f) => {
      if (str === '') {
        return `(${convertObjectToString(f)})`;
      }
      return `(${str.substring(1, str.length - 1)}|${convertObjectToString(f)})`;
    }, '');
  }
  if (filter.constructor === Object) {
    const filterArray = [];
    if (filter.SIV_ATTRIBUTE) {
      const filterString = Object.keys(filter.SIV_ATTRIBUTE)
        .map(type => Object.keys(filter.SIV_ATTRIBUTE[type]).map(subtype => {
          const equalOp = subtype.includes('include') ? '==' : '!=';
          const values = filter.SIV_ATTRIBUTE[type][subtype].map(value => `${value}`).join(',');
          return `SIV_ATTRIBUTE(${type})${equalOp}[${values}]`;
        }))
        .reduce(concat, [])
        .join('&');

      filterArray.push(filterString);
    }
    if (filter.CATEGORY) {
      const { CATEGORY } = filter;
      const filterString = Object.keys(CATEGORY)
        .map(key => {
          const equalOp = key.includes('include') ? '==' : '!=';
          const subcategoryOp = key.includes('Without') ? 'false' : 'true';
          const values = CATEGORY[key].map(value => `"${value}"`).join(',');
          return `CATEGORY(${subcategoryOp})${equalOp}[${values}]`;
        })
        .join('&');
      filterArray.push(filterString);
    }
    if (filter.array) {
      filterArray.push(convertObjectToString(filter.array));
    }
    return filterArray.join('&');
  }
  return '';
}

/* eslint-disable no-param-reassign */
function setSivValues(parsedFilter, sivExcludedFilter, subtype, values) {
  let excludedIds = sivExcludedFilter ? sivExcludedFilter.SIV_ATTRIBUTE.id.excluded : [];
  if (subtype === 'id-excluded') {
    excludedIds = values;
    // Rewrite this so that we don't need param reassign
    parsedFilter.forEach((f, index) => {
      if (
        parsedFilter[index].SIV_ATTRIBUTE
        && parsedFilter[index].SIV_ATTRIBUTE.id
        && parsedFilter[index].SIV_ATTRIBUTE.id.included
      ) {
        parsedFilter[index].SIV_ATTRIBUTE.id.included = parsedFilter[index].SIV_ATTRIBUTE.id.included.filter(
          id => !values.includes(id),
        );
      }
      // If all the included values are filtered out, delete SIV_ATTRIBUTE key
      if (
        parsedFilter[index].SIV_ATTRIBUTE
        && parsedFilter[index].SIV_ATTRIBUTE.id
        && parsedFilter[index].SIV_ATTRIBUTE.id.included
        && parsedFilter[index].SIV_ATTRIBUTE.id.included.length === 0
      ) {
        delete parsedFilter[index].SIV_ATTRIBUTE.id;
      }
    });
  }
  if (subtype === 'id-included') {
    let updated = false;
    if (sivExcludedFilter) {
      excludedIds = excludedIds.filter(id => !values.includes(id));
    }
    parsedFilter.forEach((f, index) => {
      if (
        parsedFilter[index].SIV_ATTRIBUTE
        && parsedFilter[index].SIV_ATTRIBUTE.id
        && parsedFilter[index].SIV_ATTRIBUTE.id.included
      ) {
        parsedFilter[index].SIV_ATTRIBUTE.id.included = values;
        updated = true;
      }
    });
    if (!updated) {
      parsedFilter.push({ SIV_ATTRIBUTE: { id: { included: values } } });
    }
  }
  if (subtype === 'supplier-included') {
    parsedFilter.push({ SIV_ATTRIBUTE: { supplier: { included: values } } });
  }
  const updatedSivExcludedFilter = excludedIds.length ? { SIV_ATTRIBUTE: { id: { excluded: excludedIds } } } : null;
  return { parsedFilter, updatedSivExcludedFilter };
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

  // SIV ATTRIBUTE Excluded is a special case where if the value is excluded that is "ANDed" to all the other rules.
  // So we extract it out
  let sivExcludedFilter;
  parsedFilter.forEach((filter, index) => {
    // This whole if condition is to achieve the SIV excluded extraction mentioned above
    if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id.excluded) {
      if (sivExcludedFilter) {
        sivExcludedFilter.SIV_ATTRIBUTE.id.excluded.push(...parsedFilter[index].SIV_ATTRIBUTE.id.excluded);
      } else {
        sivExcludedFilter = {
          SIV_ATTRIBUTE: {
            id: {
              excluded: parsedFilter[index].SIV_ATTRIBUTE.id.excluded,
            },
          },
        };
      }
      delete parsedFilter[index].SIV_ATTRIBUTE.id.excluded;
    }
  });

  // Assuming filters are currently going to have only a single & at the top level for now
  if (parsedFilter.length === 1 && parsedFilter[0].array) {
    parsedFilter = parsedFilter[0].array;
  }

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
        parsedFilter.push({ CATEGORY });
      }
      break;
    }
    case 'SIV': {
      ({ updatedSivExcludedFilter: sivExcludedFilter, parsedFilter } = setSivValues(
        parsedFilter,
        sivExcludedFilter,
        subtype,
        values,
      ));
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
  if (sivExcludedFilter && parsedFilter.length) {
    sivExcludedFilter.array = parsedFilter;
  }
  const convertedFilter = sivExcludedFilter || parsedFilter;
  return convertObjectToString(convertedFilter);
}

export { addToFilter, parseFilterString, setFilter };
//# sourceMappingURL=ro-filter-parser.esm.js.map

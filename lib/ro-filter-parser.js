import { isEmpty } from 'ramda';
import { setCategoryCodes, addCategoryCodes } from './util/category';
import convertObjectToString from './util/object-to-string';
import setSivValues from './util/set-siv-values';
import deleteEmptyKeys from './util/delete-empty-keys';
import extractSivIncluded from './util/extract-siv-included';

const nearley = require('nearley');
const grammar = require('../lib/compiled-grammar/main');

/**
 * Parses the filter string to return a JSON object
 *
 * @export
 * @param {string} filterString - the filter string
 * @returns {object} - a json representation of the string
 * @example
 *     parseFilterString('CATEGORY(true)!="abc"')
 *     returns: [
 *          {
 *            CATEGORY: {
 *              excludedWithSubCategories: ["abc"]
 *            }
 *          }
 *        ]
 */
export function parseFilterString(filterString) {
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(filterString);

  const { results } = parser;

  if (results.length === 0) return 'Empty result. Weird!';

  return results[0];
}

/**
 * Takes a filter string and a json object and updates filter string with the JSON object.
 * Existing values for the quantity being set are blown away
 *
 * @export
 * @param {string} definition
 * @param {object} { label, subtype, values }
 * @returns {string} The filter difinition with the values added to the initial definition
 * @example
 *    setFilter("SIV_ATTRIBUTE(id)=[123]", { label: 'CATEGORY', subtype: 'subcategory-included', values: ["cat1"]})
 *    returns: `CATEGORY(true)==["cat1"]|SIV_ATTRIBUTE(id)==[123]`
 */
export function setFilter(definition, { label, subtype, values }) {
  let parsedFilter;
  if (definition !== '') {
    parsedFilter = parseFilterString(definition);
  } else {
    parsedFilter = [{}];
  }

  // SIV ATTRIBUTE Included is a special case where if the value is included that is "ORed" to all the other rules.
  // So we extract it out
  let sivIncluded;
  ({ updatedSivIncluded: sivIncluded, updatedFilter: parsedFilter } = extractSivIncluded(parsedFilter, sivIncluded));

  parsedFilter.forEach((filter, index) => {
    if (parsedFilter[index].array) {
      const cleanArray = parsedFilter[index].array.map(f => deleteEmptyKeys(f)).filter(f => !isEmpty(f));
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
  parsedFilter = parsedFilter.map(f => deleteEmptyKeys(f)).filter(filter => !isEmpty(filter));
  if (sivIncluded && parsedFilter.length) {
    // If the filter has only `SIV_ATTRIBUTE(id)!=[values]`, then ORing it with the IDs is essentially
    // going to return all the items in our system except the excluded ones. Technically correct, but we
    // don't want that. So if its only included and excluded. Remove the excluded.
    if (
      parsedFilter.length === 1
      && Object.keys(parsedFilter[0]).length === 1
      && parsedFilter[0].SIV_ATTRIBUTE
      && Object.keys(parsedFilter[0].SIV_ATTRIBUTE).length === 1
      && parsedFilter[0].SIV_ATTRIBUTE.id
    ) {
      parsedFilter = sivIncluded;
    } else {
      parsedFilter.push(sivIncluded);
    }
  }
  const convertedFilter = parsedFilter.length ? parsedFilter : sivIncluded;
  return convertedFilter ? convertObjectToString(convertedFilter) : 'SIV_ATTRIBUTE(id)==[0]';
}

export function addToFilter(definition, { label, subtype, values }) {
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

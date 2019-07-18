import { setCategoryCodes, addCategoryCodes } from './util/category';
import convertObjectToString from './util/object-to-string';
import setSivValues from './util/siv';
import cleanObject from './util/clean-object';

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

  const { results } = parser;
  if (results.length > 1) return 'Ambigous grammar. Bad!';
  if (results.length === 0) return 'Empty result. Weird!';

  return results[0];
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

export function setFilter(definition, { label, subtype, values }) {
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

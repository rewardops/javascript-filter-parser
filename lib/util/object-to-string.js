// Coz flatMap seems to be implemented only in Node11
import { flatten } from 'ramda';

/**
 * This function consumes a filter as a JSON object and returns the filter string representation
 *
 * @export
 * @param {object} filter
 * @returns {string} The filter in a string representation
 * @example
 * convertObjectToString({SIV_ATTRIBUTE: {id: included: [123]}})
 * returns: `SIV_ATTRIBUTE(id)==[123]`
 */
export default function convertObjectToString(filter) {
  if (filter === null) {
    return null;
  }
  if (filter && filter.constructor === Array) {
    return filter.map(f => `${convertObjectToString(f)}`).join('|');
  }
  if (filter && filter.constructor === Object) {
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

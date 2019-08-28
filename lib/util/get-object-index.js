import { isEmpty } from 'ramda';
import deleteEmptyKeys from './clean-object';

/**
 * Function to get the index of the first non empty object in the array. This may need cleanup in the future
 *
 * @export
 * @param {array} filterArray
 * @returns Returns the index of the first non empty object
 */
export default function getObjectIndex(filterArray) {
  let result = 0;
  filterArray.forEach((f, i) => {
    // This can be made faster by defining a function which just checks for non empty
    // instead of cleaning it
    const cleanF = deleteEmptyKeys(f);
    if (!isEmpty(cleanF)) {
      result = i;
    }
  });
  return result;
}

import { isEmpty } from 'ramda';
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

  deleteEmptyKeys(test)
  Output: { SIV: { incl: [ 1 ] } }
 */
export default function deleteEmptyKeys(obj) {
  const resultObject = {};
  Object.keys(obj).forEach(key => {
    if (obj[key].constructor === Object) {
      resultObject[key] = deleteEmptyKeys(obj[key]);
      if (isEmpty(resultObject[key])) {
        delete resultObject[key];
      }
    } else {
      resultObject[key] = obj[key];
    }
  });
  return resultObject;
}

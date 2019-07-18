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
export default function cleanObject(obj) {
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

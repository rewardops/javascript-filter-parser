import { isEmpty } from 'ramda';
import cleanObject from './clean-object';

export default function getObjectIndex(filterArray) {
  let result = 0;
  filterArray.forEach((f, i) => {
    // This can be made faster by defining a function which just checks for non empty
    // instead of cleaning it
    const cleanF = cleanObject(f);
    if (!isEmpty(cleanF)) {
      result = i;
    }
  });
  return result;
}

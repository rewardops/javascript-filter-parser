import { mergeDeepRight } from 'ramda';
import getObjectIndex from './get-object-index';

/* eslint-disable no-param-reassign */
/**
 * Handles the logic of setting the SIV values in the right place on the filter
 *
 * @export
 * @param {object} parsedFilter
 * @param {array} sivIncluded
 * @param {string} subtype
 * @param {array} values
 * @returns Return the filter object with the siv values set in the right place
 */
export default function setSivValues(parsedFilter, sivIncluded, subtype, values) {
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

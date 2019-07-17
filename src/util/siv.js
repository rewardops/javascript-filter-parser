/* eslint-disable no-param-reassign */
export default function setSivValues(parsedFilter, sivExcludedFilter, subtype, values) {
  let excludedIds = sivExcludedFilter ? sivExcludedFilter.SIV_ATTRIBUTE.id.excluded : [];
  if (subtype === 'id-excluded') {
    // if (sivExcludedFilter) {
    //   excludedIds.push(...values);
    // } else {
    //   excludedIds = values;
    // }
    excludedIds = values;
    // TODO: Rewrite this so that we don't need param reassign
    parsedFilter.forEach((f, index) => {
      if (parsedFilter[index].SIV_ATTRIBUTE) {
        parsedFilter[index].SIV_ATTRIBUTE.id.included = parsedFilter[index].SIV_ATTRIBUTE.id.included.filter(
          id => !values.includes(id),
        );
      }
      // If all the included values are filtered out, delete SIV_ATTRIBUTE key
      if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id.included.length === 0) {
        delete parsedFilter[index].SIV_ATTRIBUTE;
      }
    });
  }
  if (subtype === 'id-included') {
    let updated = false;
    if (sivExcludedFilter) {
      excludedIds = excludedIds.filter(id => !values.includes(id));
    }
    parsedFilter.forEach((f, index) => {
      if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id.included) {
        parsedFilter[index].SIV_ATTRIBUTE.id.included = values;
        updated = true;
      }
    });
    if (!updated) {
      parsedFilter.push({ SIV_ATTRIBUTE: { id: { included: values } } });
    }
  }
  const updatedSivExcludedFilter = excludedIds.length ? { SIV_ATTRIBUTE: { id: { excluded: excludedIds } } } : null;
  return { parsedFilter, updatedSivExcludedFilter };
}

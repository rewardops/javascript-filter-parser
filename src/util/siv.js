/* eslint-disable no-param-reassign */
export default function setSivValues(parsedFilter, sivExcludedFilter, subtype, values) {
  if (subtype === 'id-excluded') {
    if (sivExcludedFilter) {
      sivExcludedFilter.SIV_ATTRIBUTE.id.excluded.push(...values);
    } else {
      sivExcludedFilter = {
        SIV_ATTRIBUTE: {
          id: {
            excluded: values,
          },
        },
      };
    }
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
  return { parsedFilter, sivExcludedFilter };
}

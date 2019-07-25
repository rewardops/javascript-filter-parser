export default function extractSivIncluded(parsedFilter, sivIncluded) {
  let updatedSivIncluded = sivIncluded;
  const updatedFilter = parsedFilter.map(filter => {
    if (filter.SIV_ATTRIBUTE && filter.SIV_ATTRIBUTE.id && filter.SIV_ATTRIBUTE.id.included) {
      if (updatedSivIncluded) {
        updatedSivIncluded.SIV_ATTRIBUTE.id.included.push(...filter.SIV_ATTRIBUTE.id.included);
      } else {
        updatedSivIncluded = {
          SIV_ATTRIBUTE: {
            id: {
              included: filter.SIV_ATTRIBUTE.id.included,
            },
          },
        };
      }
      delete filter.SIV_ATTRIBUTE.id.included;
    }
    if (filter.array) {
      ({ updatedFilter: filter.array, updatedSivIncluded } = extractSivIncluded(filter.array, updatedSivIncluded));
      // This is being done because of the way the current filter definitions are set up where they are wrongly grouped based on the OR.
      // Basically all the current definitions have been slightly wrong but because they were never grouped with anything else, it was not noticable.
      filter.array.forEach(f => {
        if (f.CATEGORY) {
          filter.CATEGORY = f.CATEGORY;
        }
        delete f.CATEGORY;
      });
    }
    return filter;
  });
  return { updatedFilter, updatedSivIncluded };
}

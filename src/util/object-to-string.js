export default function convertObjectToString(filter) {
  if (filter.constructor === Array) {
    return filter.reduce((str, f) => {
      if (str === '') {
        return `(${convertObjectToString(f)})`;
      }
      return `(${str.substring(1, str.length - 1)}|${convertObjectToString(f)})`;
    }, '');
  }
  if (filter.constructor === Object) {
    const filterArray = [];
    if (filter.SIV_ATTRIBUTE) {
      const { id } = filter.SIV_ATTRIBUTE;
      const filterString = Object.keys(id).map(key => {
        const equalOp = key.includes('include') ? '==' : '!=';
        const values = id[key].map(value => `${value}`).join(',');
        return `SIV_ATTRIBUTE(id)${equalOp}[${values}]`;
      });
      filterArray.push(filterString);
    }
    if (filter.CATEGORY) {
      const { CATEGORY } = filter;
      const filterString = Object.keys(CATEGORY)
        .map(key => {
          const equalOp = key.includes('include') ? '==' : '!=';
          const subcategoryOp = key.includes('Without') ? 'false' : 'true';
          const values = CATEGORY[key].map(value => `"${value}"`).join(',');
          return `CATEGORY(${subcategoryOp})${equalOp}[${values}]`;
        })
        .join('&');
      filterArray.push(filterString);
    }
    return filterArray.join('&');
  }
  return '';
}

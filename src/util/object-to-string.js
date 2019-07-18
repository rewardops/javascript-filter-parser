// Coz flatMap seems to be implemented only in Node11
const concat = (x, y) => x.concat(y);

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
      const filterString = Object.keys(filter.SIV_ATTRIBUTE)
        .map(type => Object.keys(filter.SIV_ATTRIBUTE[type]).map(subtype => {
          const equalOp = subtype.includes('include') ? '==' : '!=';
          const values = filter.SIV_ATTRIBUTE[type][subtype].map(value => `${value}`).join(',');
          return `SIV_ATTRIBUTE(${type})${equalOp}[${values}]`;
        }))
        .reduce(concat, [])
        .join('&');

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
    if (filter.array) {
      filterArray.push(convertObjectToString(filter.array));
    }
    return filterArray.join('&');
  }
  return '';
}

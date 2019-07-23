export default function getObjectIndex(filterArray) {
  let result;
  filterArray.forEach((f, i) => {
    if (JSON.stringify(f) !== '{}') {
      result = i;
    }
  });
  return result;
}

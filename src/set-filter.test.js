import { setFilter } from './ro-filter-parser';

const cat1 = 'Pikachu_1';
const cat2 = 'Raichu_2';
const cat3 = 'Charizard_3';
const siv1 = 123;
const siv2 = 214;
// const siv3 = 980;

// SETTING CATEGORY WITH INITIAL VALUE
test('can set a category code in the filter definition when it already has a category code', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(CATEGORY(true)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code to the filter definition when the included type is off the same type', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(CATEGORY(false)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code to the filter definition when it also includes SIV ids', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(CATEGORY(false)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code to the filter definition when it also includes SIV ids (changed order)', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]|CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)==[${siv1}]|CATEGORY(false)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code to the filter definition when it excludes SIV ids', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(false)==["${cat1}"])`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(false)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

// SETTING CATEGORY WHEN NOT INITIALLY PRESENT
test('can set a category code to the filter definition when it has only SIV attributes (SIV Included)', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)==[${siv1}]|CATEGORY(true)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code to the filter definition when it has only SIV attributes (SIV Excluded)', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(true)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code to the filter definition when it has only SIV attributes (SIV Excluded and Included)', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(id)==[${siv2}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(SIV_ATTRIBUTE(id)==[${siv2}]|CATEGORY(true)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

// REMOVING CATEGORY
test('can remove a category code from the filter definition', () => {});

// SIV
test('can set a SIV ID to the filter definition when it does not currently have an SIV ID attribute', () => {});
test('can set a SIV ID to the filter definition when it currently has an SIV ID attribute', () => {});
test('can remove a SIV ID to the filter definition when it currently has an SIV ID attribute', () => {});

// Supplier
test('can set a supplierId to the filter definition when it does not currently have an supplierId attribute', () => {});
test('can set a supplierId to the filter definition when it currently has an supplierId attribute', () => {});
test('can remove a supplierId to the filter definition when it currently has an supplierId attribute', () => {});

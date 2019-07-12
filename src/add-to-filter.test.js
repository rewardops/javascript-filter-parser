import { addToFilter } from './ro-filter-parser.js';

const cat1 = 'Pikachu_1';
const cat2 = 'Raichu_2';
const cat3 = 'Charizard_3';
const siv1 = 123;
const siv2 = 214;
const siv3 = 980;

// Category
test('can add a category code to the filter definition', () => {
  const filterString = `CATEGORY(true)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2],
  };
  const expectedFilterString = `(CATEGORY(true)==["${cat1}","${cat2}"])`;
  expect(addToFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('can add a category code to the filter definition when not including subcategory', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2],
  };
  const expectedFilterString = `(CATEGORY(false)==["${cat1}","${cat2}"])`;
  expect(addToFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('can add a category code to the filter definition when it also includes SIV ids', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2],
  };
  const expectedFilterString = `(CATEGORY(false)==["${cat1}","${cat2}"]|SIV_ATTRIBUTE(id)==[${siv1}])`;
  expect(addToFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('can remove a category code from the filter definition', () => {});
test('can add a category code to the filter definition when it has only SIV attributes', () => {});

// SIV
test('can add a SIV ID to the filter definition when it does not currently have an SIV ID attribute', () => {});
test('can add a SIV ID to the filter definition when it currently has an SIV ID attribute', () => {});
test('can remove a SIV ID to the filter definition when it currently has an SIV ID attribute', () => {});

// Supplier
test('can add a supplierId to the filter definition when it does not currently have an supplierId attribute', () => {});
test('can add a supplierId to the filter definition when it currently has an supplierId attribute', () => {});
test('can remove a supplierId to the filter definition when it currently has an supplierId attribute', () => {});

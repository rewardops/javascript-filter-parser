import { addToFilter } from '../lib/ro-filter-parser';

const cat1 = 'Pikachu_1';
const cat2 = 'Raichu_2';
const siv1 = 123;

// Category
test('can add a category code to the filter definition', () => {
  const filterString = `CATEGORY(true)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2],
  };
  const expectedFilterString = `CATEGORY(true)==["${cat1}","${cat2}"]`;
  expect(addToFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can add a category code to the filter definition when not including subcategory', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2],
  };
  const expectedFilterString = `CATEGORY(false)==["${cat1}","${cat2}"]`;
  expect(addToFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can add a category code to the filter definition when it also includes SIV ids', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2],
  };
  const expectedFilterString = `CATEGORY(false)==["${cat1}","${cat2}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  expect(addToFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test.todo('can remove a category code from the filter definition');
test.todo('can add a category code to the filter definition when it has only SIV attributes');

// SIV
test.todo('can add a SIV ID to the filter definition when it does not currently have an SIV ID attribute');
test.todo('can add a SIV ID to the filter definition when it currently has an SIV ID attribute');
test.todo('can remove a SIV ID to the filter definition when it currently has an SIV ID attribute');

// Supplier
test.todo('can add a supplierId to the filter definition when it does not currently have an supplierId attribute');
test.todo('can add a supplierId to the filter definition when it currently has an supplierId attribute');
test.todo('can remove a supplierId to the filter definition when it currently has an supplierId attribute');

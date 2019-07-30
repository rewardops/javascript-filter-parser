import { setFilter } from '../lib/ro-filter-parser';

const cat1 = 'Pikachu_1';
const cat2 = 'Raichu_2';
const cat3 = 'Charizard_3';
const siv1 = 123;
const siv2 = 214;
const siv3 = 980;
const supplier1 = 355;
const supplier2 = 968;
const supplier3 = 1;

// SETTING CATEGORY WITH INITIAL VALUE
test('category code - when filter is empty', () => {
  const filterString = '';
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('can set a category code in the filter definition when it already has a category code', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('can set a category code in the filter definition when it already has a category code, SIV included and SIV excluded', () => {
  const filterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat2}","${cat3}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code - when the included type is off the same type', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `CATEGORY(false)==["${cat2}","${cat3}"]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code - when it also includes SIV ids', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `CATEGORY(false)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code - when it also includes SIV ids (changed order)', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]|CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code - when it excludes SIV ids', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(false)==["${cat1}"])`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(false)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('can set a category code - when it currently has supplier and category', () => {
  const filterString = `(SIV_ATTRIBUTE(supplier)==[${siv1}]&CATEGORY(true)==["${cat2}"])`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-excluded',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(supplier)==[${siv1}]&CATEGORY(false)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

// SETTING CATEGORY WHEN NOT INITIALLY PRESENT
test('can set a category code - when it has only SIV attributes (SIV Included)', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code - when it has only SIV attributes (SIV Excluded)', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat2}","${cat3}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('can set a category code - when it has only SIV attributes (SIV Excluded and Included)', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(id)==[${siv2}]`;
  const newFilterObject = {
    label: 'CATEGORY',
    subtype: 'subcategory-included',
    values: [cat2, cat3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat2}","${cat3}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

// SIV
test('SIV ID - when it does not currently have an SIV ID attribute - included', () => {
  const filterString = `CATEGORY(false)==["${cat1}"]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-included',
    values: [siv2, siv3],
  };
  const expectedFilterString = `CATEGORY(false)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv2},${siv3}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - when it currently does not have an SIV ID attribute - excluded', () => {
  const filterString = `CATEGORY(false)==["${cat2}"]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-excluded',
    values: [siv2, siv3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv2},${siv3}]&${filterString})`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('SIV ID - set Included - currently SIV ID included', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-included',
    values: [siv2, siv3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)==[${siv2},${siv3}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - when it currently does not have an SIV ID attribute excluded but has SIV ID included', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-excluded',
    values: [siv2, siv3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv2},${siv3}]|${filterString}`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - when it currently does not have an SIV ID attribute excluded but has SIV ID included and the excluded value is in included', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv2}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-excluded',
    values: [siv2, siv3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv2},${siv3}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - when it currently has an SIV ID attribute excluded', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-excluded',
    values: [siv2, siv3],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv2},${siv3}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - set Excluded - when it has ID included, excluded and category code', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(true)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv2}])`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-excluded',
    values: [siv2, siv3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv2},${siv3}]&CATEGORY(true)==["${cat1}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - set Included - when it has ID included, excluded and category code', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(CATEGORY(true)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv2}])`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-included',
    values: [siv2, siv3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2},${siv3}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - set Included - when it has SIV excluded and Supplier ID', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(SIV_ATTRIBUTE(supplier)==[${supplier1}])`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-included',
    values: [siv2, siv3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(supplier)==[${supplier1}])|SIV_ATTRIBUTE(id)==[${siv2},${siv3}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('SIV ID - set excluded - when it has SIV excluded and Supplier ID', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(SIV_ATTRIBUTE(supplier)==[${supplier1}])`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'id-excluded',
    values: [siv2, siv3],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv2},${siv3}]&SIV_ATTRIBUTE(supplier)==[${supplier1}])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

// Supplier
test('supplierId - when it does not currently have an supplierId', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(true)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv2}])`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('supplierId - include - when currently only SIV ID excluded exists', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('supplierId - include - when currently only SIV ID included exists', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('supplierId - include - when currently only category code included exists', () => {
  const filterString = `CATEGORY(true)==["${cat1}"]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}]&CATEGORY(true)==["${cat1}"])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});
test('supplierId - when it currently has an supplierId', () => {
  const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('supplierId - when it currently has a supplierId and a SIV id excluded', () => {
  const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]&SIV_ATTRIBUTE(id)!=[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `(SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}]&SIV_ATTRIBUTE(id)!=[${siv1}])`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

test('supplierId - when it currently has a supplierId and a SIV id included', () => {
  const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  const newFilterObject = {
    label: 'SIV',
    subtype: 'supplier-included',
    values: [supplier1, supplier2],
  };
  const expectedFilterString = `SIV_ATTRIBUTE(supplier)==[${supplier1},${supplier2}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
  expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
});

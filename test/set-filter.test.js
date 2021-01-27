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

describe('Including Category', () => {
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
  test('category code in the filter definition when it already has a category code', () => {
    const filterString = `CATEGORY(false)==["${cat1}"]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-included',
      values: [cat2, cat3],
    };
    const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('category code in the filter definition when it already has a category code, SIV included and SIV excluded', () => {
    const filterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-included',
      values: [cat2, cat3],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat2}","${cat3}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('category code - when it also includes SIV ids (changed order)', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]|CATEGORY(false)==["${cat1}"]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-included',
      values: [cat2, cat3],
    };
    const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('category code - when it has only SIV attributes (SIV Included)', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-included',
      values: [cat2, cat3],
    };
    const expectedFilterString = `CATEGORY(true)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });

  test('category code - when it has only SIV attributes (SIV Excluded)', () => {
    const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-included',
      values: [cat2, cat3],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat2}","${cat3}"])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });

  test('category code - when it has only SIV attributes (SIV Excluded and Included)', () => {
    const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(id)==[${siv2}]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-included',
      values: [cat2, cat3],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(true)==["${cat2}","${cat3}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
});

describe('Excluding Categories', () => {
  test('category code - when the included type is off the same type', () => {
    const filterString = `CATEGORY(false)==["${cat1}"]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-excluded',
      values: [cat2, cat3],
    };
    const expectedFilterString = `CATEGORY(false)==["${cat2}","${cat3}"]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });

  test('category code - when it also includes SIV ids', () => {
    const filterString = `CATEGORY(false)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-excluded',
      values: [cat2, cat3],
    };
    const expectedFilterString = `CATEGORY(false)==["${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });

  test('category code - when it excludes SIV ids', () => {
    const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(false)==["${cat1}"])`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-excluded',
      values: [cat2, cat3],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&CATEGORY(false)==["${cat2}","${cat3}"])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('category code - when it currently has supplier and category', () => {
    const filterString = `(SIV_ATTRIBUTE(supplier)==[${siv1}]&CATEGORY(true)==["${cat2}"])`;
    const newFilterObject = {
      label: 'CATEGORY',
      subtype: 'subcategory-excluded',
      values: [cat2, cat3],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(supplier)==[${siv1}]&CATEGORY(false)==["${cat2}","${cat3}"])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
});

describe('Including SIV ID', () => {
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
  test('SIV ID - set Included - when it has category and Supplier ID', () => {
    const filterString = `(SIV_ATTRIBUTE(supplier)==[${supplier1}]&CATEGORY(true)==["${cat1}"])`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-included',
      values: [siv2, siv3],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(supplier)==[${supplier1}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2},${siv3}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  // When setting to empty value
  test('SIV ID Included - when setting an empty value', () => {
    const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-included',
      values: [],
    };
    const expectedFilterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
});

describe('Excluding SIV ID', () => {
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
  test('SIV ID - when it only has SIV IDs and one is removed', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv1},${siv2},${siv3}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-excluded',
      values: [siv1],
    };
    const expectedFilterString = `SIV_ATTRIBUTE(id)==[${siv2},${siv3}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('SIV ID - when it only has one SIV ID and it is removed', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-excluded',
      values: [siv1],
    };
    const expectedFilterString = null;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('SIV ID - when it currently does not have an SIV ID attribute excluded but has SIV ID included', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-excluded',
      values: [siv2, siv3],
    };
    const expectedFilterString = `${filterString}`; // This is a special case because filter with item!=id basically means every other item. And we don't currently want that
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('SIV ID - when it currently does not have an SIV ID attribute excluded but has SIV ID included and the excluded value is in included', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv2}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-excluded',
      values: [siv2, siv3],
    };
    const expectedFilterString = `SIV_ATTRIBUTE(id)!=[${siv3}]`;
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
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv3}]&CATEGORY(true)==["${cat1}"])`;
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
  test('SIV ID - when filter has only ID included and ID excluded', () => {
    const filterString =
      'SIV_ATTRIBUTE(id)!=[51036,51037,72970]&(SIV_ATTRIBUTE(id)==[51325,51327,51334,72971,76176,76177,76178,76182,87338])';
    const newFilterObject = {
      label: 'SIV',
      subtype: 'id-excluded',
      values: [87338],
    };
    const expectedFilterString = 'SIV_ATTRIBUTE(id)==[51325,51327,51334,72971,76176,76177,76178,76182]';
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
});

describe('Including SIV Supplier', () => {
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
  // Setting empty value
  test('supplierId - when it currently has a supplierId and a SIV id included', () => {
    const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-included',
      values: [],
    };
    const expectedFilterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  // Emptying filter definition
  test.skip('supplierId - when it currently has a supplierId and no SIV ids included', () => {
    const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-included',
      values: [],
    };
    const expectedFilterString = 'SIV_ATTRIBUTE(id)==[0]';
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
});

describe('Excluding SIV Supplier', () => {
  test('supplierId - when it does not currently have an supplierId', () => {
    const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]&(CATEGORY(true)==["${cat1}"]|SIV_ATTRIBUTE(id)==[${siv2}])`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('supplierId - include - when currently only SIV ID excluded exists', () => {
    const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(id)!=[${siv1}]&SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('supplierId - include - when currently only SIV ID included exists', () => {
    const filterString = `SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('supplierId - include - when currently only category code included exists', () => {
    const filterString = `CATEGORY(true)==["${cat1}"]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}]&CATEGORY(true)==["${cat1}"])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
  test('supplierId - when it currently has an supplierId', () => {
    const filterString = `SIV_ATTRIBUTE(supplier)==[${supplier3}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(supplier)==[${supplier3}]&SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });

  test('supplierId - when it currently has a supplierId and a SIV id excluded', () => {
    const filterString = `SIV_ATTRIBUTE(supplier)!=[${supplier3}]&SIV_ATTRIBUTE(id)!=[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `(SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}]&SIV_ATTRIBUTE(id)!=[${siv1}])`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });

  test('supplierId - when it currently has a supplierId and a SIV id included', () => {
    const filterString = `SIV_ATTRIBUTE(supplier)!=[${supplier3}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    const newFilterObject = {
      label: 'SIV',
      subtype: 'supplier-excluded',
      values: [supplier1, supplier2],
    };
    const expectedFilterString = `SIV_ATTRIBUTE(supplier)!=[${supplier1},${supplier2}]|SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(setFilter(filterString, newFilterObject)).toStrictEqual(expectedFilterString);
  });
});

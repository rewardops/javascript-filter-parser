import convertObjectToString from '../lib/util/object-to-string';

const cat1 = 'Pikachu_1';
const cat2 = 'Raichu_2';
const siv1 = 123;
const siv2 = 214;
const randomString = 'random string';
const randomNumber = 42;

describe('Valid inputs', () => {
  test('SIV included returns correct filter string', () => {
    const inputObject = {
      SIV_ATTRIBUTE: {
        id: { included: [siv1] },
      },
    };
    const expectedOutput = `SIV_ATTRIBUTE(id)==[${siv1}]`;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('SIVs excluded returns correct filter string', () => {
    const inputObject = {
      SIV_ATTRIBUTE: {
        id: { excluded: [siv1, siv2] },
      },
    };
    const expectedOutput = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]`;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('SIV included, CATEGORY included with subcategories returns correct filter string', () => {
    const inputObject = [
      {
        CATEGORY: {
          includedWithSubcategories: [cat1],
        },
        SIV_ATTRIBUTE: {
          id: {
            included: [siv1],
          },
        },
      },
    ];
    const expectedOutput = `(SIV_ATTRIBUTE(id)==[${siv1}]&CATEGORY(true)==["${cat1}"])`;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('SIVs excluded, CATEGORIES included without subcategories returns correct filter string', () => {
    const inputObject = [
      {
        CATEGORY: {
          includedWithoutSubcategories: [cat1, cat2],
        },
        SIV_ATTRIBUTE: {
          id: {
            excluded: [siv1, siv2],
          },
        },
      },
    ];
    const expectedOutput = `(SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&CATEGORY(false)==["${cat1}","${cat2}"])`;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('SIVs included, CATEGORIES excluded with subcategories returns correct filter string', () => {
    const inputObject = [
      {
        CATEGORY: {
          excludedWithSubcategories: [cat1, cat2],
        },
        SIV_ATTRIBUTE: {
          id: {
            included: [siv1, siv2],
          },
        },
      },
    ];
    const expectedOutput = `(SIV_ATTRIBUTE(id)==[${siv1},${siv2}]&CATEGORY(true)!=["${cat1}","${cat2}"])`;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
});

describe('Invalid inputs', () => {
  test('0 returns empty string', () => {
    const inputObject = 0;
    const expectedOutput = '';
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('a number returns empty string', () => {
    const inputObject = randomNumber;
    const expectedOutput = '';
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('empty string returns empty string', () => {
    const inputObject = '';
    const expectedOutput = '';
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('a string returns empty string', () => {
    const inputObject = randomString;
    const expectedOutput = '';
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('empty array returns empty string', () => {
    const inputObject = [];
    const expectedOutput = '';
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('empty object returns empty string', () => {
    const inputObject = {};
    const expectedOutput = '';
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('undefined returns null', () => {
    const inputObject = undefined;
    const expectedOutput = null;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
  test('null returns null', () => {
    const inputObject = null;
    const expectedOutput = null;
    expect(convertObjectToString(inputObject)).toStrictEqual(expectedOutput);
  });
});

/* eslint-disable no-param-reassign */
const categoryTypes = [
  'includedWithSubcategories',
  'includedWithoutSubcategories',
  'excludedWithSubcategories',
  'excludedWithoutSubcategories',
];

/**
 * Returns a category object with values set to the subtype.
 *
 * @export
 * @param {string} subtype
 * @param {Array} values
 * @returns {object} An object with the value set to the right type
 */
export function setCategoryCodes(subtype, values) {
  const updatedCat = {};
  if (subtype === 'subcategory-included') {
    updatedCat.includedWithSubcategories = [...values];
  }
  if (subtype === 'subcategory-excluded') {
    updatedCat.includedWithoutSubcategories = [...values];
  }
  return updatedCat;
}

/**
 * Returns category object with the value added to the list. If there are existing values, they are preserved.
 *
 * @export
 * @param {object} categoryObject
 * @param {string} subtype
 * @param {array} values
 * @returns {object} Retun the categoryObject with the values appended at the right place
 */
export function addCategoryCodes(categoryObject, subtype, values) {
  // If the value already exists anywhere in categories, remove it
  categoryTypes.forEach(type => {
    if (categoryObject[type]) {
      categoryObject[type] = categoryObject[type].filter(value => !values.includes(value));
    }
  });
  if (subtype === 'subcategory-included') {
    const currentValues = categoryObject.includedWithSubcategories || [];
    categoryObject.includedWithSubcategories = Array.from(new Set([...currentValues, ...values]));
  }
  if (subtype === 'subcategory-excluded') {
    const currentValues = categoryObject.includedWithoutSubcategories || [];
    categoryObject.includedWithoutSubcategories = Array.from(new Set([...currentValues, ...values]));
  }
  return categoryObject;
}

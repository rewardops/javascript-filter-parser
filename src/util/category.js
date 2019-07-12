/* eslint-disable no-param-reassign */
const categoryTypes = [
  'includedWithSubcategories',
  'includedWithoutSubcategories',
  'excludedWithSubcategories',
  'excludedWithoutSubcategories',
];

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

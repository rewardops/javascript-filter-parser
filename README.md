# javascript-filter-parser

## Overview

This parser is meant to provide a library with a `parse()` function. This function will consume a filter string of the form:

```js
const filterString =
  "category(true)==['abc','cde']&category(false)==['xyz']&category(true)!=['123']&SIV_ATTRIBUTE(id)==[12,23]&SIV_ATTRIBUTE(id)!=[65,34]";
```

So you should be able to call `Lib.parse(filterString)` and it should return a JSON object of the form:

```js
const filterObject = {
  category: [
    {
      subcategory: true,
      included: ['abc', 'cde'],
    },
    {
      subcategory: false,
      included: ['xyz'],
    },
    {
      subcategory: true,
      excluded: ['123'],
    },
  ],
  SIV_ATTRIBUTE: {
    ID: {
      included: [12, 23],
      excluded: [65, 34],
    },
  },
};
```

If we break it down to smaller chunks, we get:

### Filter With Subcategories Included

These are definitions where including a parent category automatically includes all its subcategories to the filter. In the filter string they are represented by the boolean in the parenthesis immediately after the keyword `category`. For example in the category string `category(true)==['CAT_SYS_123']`, the `true` indicates that all the subcategories are included.

These can be further divided into two types:

#### Adding categories

These filter strings are used to show the category codes which are added to the filter. These are filter strings of the form:

```js
const filterString = "category(true)==['abc', 'cde']";
```

The resulting JSON for this string should look like:

```js
const filterObject = {
  category: [
    {
      subcategory: true,
      included: ['abc', 'cde'],
    },
  ],
};
```

#### Removing categories

Very similar to the previous example but these strings denote category codes which are explicitly removed from the filter. Currently, these filter strings do not exist in the actual data but strings like these are possible. These are filter strings of the form:

```js
const filterString = "category(true)!=['xyz', 'pyf']";
```

Note that the equality operator here is `!=` and not `==`.

The resulting JSON for this string should look like:

```js
const filterObject = {
  category: [
    {
      subcategory: true,
      excluded: ['xyz', 'pyf'],
    },
  ],
};
```

The key here is called `excluded` as opposed to `included` in the previous example.

### Filter With Subcategories Excluded

A category filter definition where adding or excluding a category only applies to items marked with that particular category and items marked with categories which are subcategories to the category mentioned in the definition are unaffected by this filter rule. An example of a filter string of this type would be `category(false)==['CAT_123']` and here the boolean `false` next to the category indicates that the subcategories are not included in the definition. These have the same 2 types as the definitions where the subcategories are included:

- Adding Categories
- Removing Categories

They look exactly like their counterparts where the subcategories are included except for the boolean flag. For example, a filter string of this type where you are adding the categories would look like:

```js
const filterString = "category(false)==['abc', 'cde']";
```

The parsed JSON object for this string would be:

```js
const filterObject = {
  category: [
    {
      subcategory: false,
      included: ['abc', 'cde'],
    },
  ],
};
```

The only difference here being that the boolean value for the key `subcategory` is `false`.

## Testing

This project implements jest for testing. To run the tests, simply run `npm run test`

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

These are definitions where including a parent category automatically includes all its subcategories to the filter. TIn the filter string they are represented by the boolean in the parenthesis immediately after the keyword `category`. For example in the category string `category(true)==['CAT_SYS_123']`, the `true` indicates that all the subcategories are included.

These can be further divided into two types:

#### Adding categories

These are filter strings of the form:

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

Very similar to the previous example. These are filter strings of the form:

```js
const filterString = "category(true)!=['abc', 'cde']";
```

Note that the equality operator here is `!=` and not `==`.

The resulting JSON for this string should look like:

```js
const filterObject = {
  category: [
    {
      subcategory: true,
      excluded: ['abc', 'cde'],
    },
  ],
};
```

The key here is called `excluded` as opposed to `included` in the previous example.

## Testing

This project implements jest for testing. To run the tests, simply run `npm run test`

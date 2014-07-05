# vtree-select

Select *[virtual-dom][]* nodes using css selectors.

[virtual-dom]: https://www.npmjs.org/package/virtual-dom

## Usage

```js
var select = require("vtree-select");
var h = require("virtual-hyperscript");

var vtree = h("div", [
  h("span", "hello"),
  h("strong", "world"),
]);

select("div strong")(vtree)
// -> <strong>world</strong> (VNode object)
```

## Current Status

Selecting children is not working. See the test in test.js, line 20.

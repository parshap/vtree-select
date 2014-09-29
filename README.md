# vtree-select

Select *[vtree][]* nodes (used by *[virtual-dom][]*) using css
selectors.

Selector matching is done using *[cssauron][]*. See the documentation
for details on supported selectors.

[virtual-dom]: https://www.npmjs.org/package/virtual-dom
[vtree]: https://www.npmjs.org/package/vtree
[cssauron]: https://www.npmjs.org/package/cssauron

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

## API

### `require("vtree-select")(selector) -> match`

Create a match function that takes a vtree and returns an array of nodes
that match the selector.

### `match(vtree) -> array`

Returns an array of matched nodes, or `null` if no nodes match.

## Installation

```
npm install vtree-select
```

"use strict";

var h = require("virtual-dom/h");
var select = require("./");

var span1 = h("span.span1", "hello world");
var span2 = h("span.span2", "hello world2");
var li = h("li", "item");
var ul = h("ul", [li]);
var props = h("div", { label : 'label' });
var attrs = h("div", { attributes : {'custom-attr' : 'custom'} });
var tree = h("div#tree", [span1, span2, ul]);

var assert = require("assert");

// Select root element
assert.deepEqual(select("div")(tree), [tree]);
assert.deepEqual(select("#tree")(tree), [tree]);
assert.deepEqual(select("[id]")(tree), [tree]);
assert.deepEqual(select("[id=tree]")(tree), [tree]);
assert.deepEqual(select("div[id=tree]")(tree), [tree]);

// properties/attributes
assert.deepEqual(select('[label]')(props),[props]);
assert.deepEqual(select('[custom-attr]')(attrs),[attrs]);

// Select children
assert.deepEqual(select("span")(tree), [span1, span2]);
assert.deepEqual(select("span.span1")(tree), [span1]);
assert.deepEqual(select("span.span2")(tree), [span2]);

// 3rd tier children
assert.deepEqual(select("div ul li")(tree), [li]);

// * operator
assert.deepEqual(select("div ul > li")(tree), [li]);
assert.deepEqual(select("div * > li")(tree), [li]);
assert.deepEqual(select("*:root")(tree), [tree]);

// :contains() pseudo
assert.deepEqual(select("!* > :contains('hello')")(tree), [span1, span2]);

// matches(vtree)
assert.strictEqual(select("*:root#tree").matches(tree), true);
assert.strictEqual(select("span.span1").matches(tree.children[0]), true);
assert.strictEqual(select("zz").matches(tree), false);
assert.strictEqual(select(":not(span)").matches(tree), true);
assert.strictEqual(select(":not(div)").matches(tree), false);

// Widget
// Use widget from virtual-dom example
// See https://github.com/Matt-Esch/virtual-dom/blob/master/docs/widget.md
var TestWidget = function() {};
TestWidget.prototype.type = "Widget";
TestWidget.prototype.init = function() {};
TestWidget.prototype.update = function() {};
TestWidget.prototype.destroy = function() {};
var widget = new TestWidget();
var divWithWidget = h("div", [widget]);
assert.strictEqual(select("div").matches(divWithWidget), true);
assert.strictEqual(select("div *").matches(divWithWidget), false);
assert.strictEqual(select("*").matches(widget), false);
assert.deepEqual(select("div")(divWithWidget), [divWithWidget]);
assert.strictEqual(select("div *")(divWithWidget), null);
assert.deepEqual(select("*")(divWithWidget), [divWithWidget]);
assert.strictEqual(select("*")(widget), null);

// Thunk
// Use widget from virtual-dom example
// See https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md
var ExampleThunk = function () {};
ExampleThunk.prototype.type = "Thunk";
ExampleThunk.prototype.render = function() {};
var thunk = new ExampleThunk();
var divWithThunk = h("div", [thunk]);
assert.strictEqual(select("div").matches(divWithThunk), true);
assert.strictEqual(select("div *").matches(divWithThunk), false);
assert.strictEqual(select("*").matches(thunk), false);
assert.deepEqual(select("div")(divWithThunk), [divWithThunk]);
assert.strictEqual(select("div *")(divWithThunk), null);
assert.deepEqual(select("*")(divWithThunk), [divWithThunk]);
assert.strictEqual(select("*")(thunk), null);

// Comments created by vdom-virtualze
// See https://github.com/parshap/vtree-select/pull/7
// See https://github.com/marcelklehr/vdom-virtualize/commit/c98fb6f20489df6d84305885cbb5c9ca7383e5d5
var vdomVirtualizeComment = {
  type: "Widget",
  text: "text",
};
var divWithComment = h("div", [vdomVirtualizeComment]);
assert.strictEqual(select("div").matches(divWithComment), true);
assert.strictEqual(select("div *").matches(divWithComment), false);
assert.strictEqual(select("*").matches(vdomVirtualizeComment), false);
assert.deepEqual(select("div")(divWithComment), [divWithComment]);
assert.strictEqual(select("div *")(divWithComment), null);
assert.deepEqual(select("*")(divWithComment), [divWithComment]);
assert.strictEqual(select("*")(vdomVirtualizeComment), null);

// Class selector also works if class name in propreties
var spanWithClassInAttributes = h("span", { attributes: { class: "cls" } }, "hello world")
var treeWithClassInAttributes = h("div", [spanWithClassInAttributes]);
assert.deepEqual(
  select(".cls")(treeWithClassInAttributes), 
  [spanWithClassInAttributes]);


console.log("TAP version 13");
console.log("ok");

"use strict";

var h = require("virtual-hyperscript");
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

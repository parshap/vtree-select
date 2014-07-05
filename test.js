"use strict";

var h = require("virtual-hyperscript");
var select = require("./");

var vtree = h("div#test", [
	h("span#test2", "hello world"),
	h("span", "hello world2"),
]);

var assert = require("assert");

// Select root element
assert(select("div")(vtree));
assert(select("[id]")(vtree));
assert(select("[id=test]")(vtree));
assert(select("div[id=test]")(vtree));

// Select children
assert(select("span")(vtree));

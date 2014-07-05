"use strict";

// @TODO text content

var language = require("cssauron")({
  tag: "tagName",
  children: "children",
  parent: "parent",
  attr: function(node, attr) {
    return node.properties[attr];
  },
  class: function(node) {
    return node.properties.class;
  },
  id: function(node) {
    return node.properties.id;
  },
});

module.exports = function(sel) {
  var selector = language(sel);
  return function(vtree) {
    var node = mapTree(vtree);
    var result = selector(node);
    // var result = selector(mapTree(vtree));
    if (result) {
      if ( ! Array.isArray(result)) {
        result = [result];
      }
      // Map the result back to a vtree
      return mapResult(result);
    }
    return result;
  };
};

function mapResult(result) {
  return result.map(function(node){
    return node.vtree;
  });
}

function mapTree(vtree, parent) {
  if (vtree.type === "VirtualText") {
    return {
      contents: vtree.text,
    };
  }

  return {
    tagName: vtree.tagName,
    children: vtree.children.map(function(child) {
      return mapTree(child, vtree);
    }),
    properties: vtree.properties,
    parent: parent,
    vtree: vtree,
  };
}

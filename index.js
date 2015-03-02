"use strict";

// @TODO text content

var language = require("cssauron")({
  tag: "tagName",
  children: "children",
  parent: "parent",
  contents: "contents",
  attr: function(node, attr) {
    if (node.properties) {
      var attrs = node.properties.attributes
      if(attrs && attrs[attr]){
        return attrs[attr];
      }
      return node.properties[attr];
    }
  },
  class: function(node) {
    return node.properties.className;
  },
  id: function(node) {
    return node.properties.id;
  },
});

module.exports = function(sel) {
  var selector = language(sel);
  function match(vtree) {
    var node = mapTree(vtree);
    var matched = [];

    // Traverse each node in the tree and see if it matches our selector
    traverse(node, function(node) {
      var result = selector(node);
      if (result) {
        if ( ! Array.isArray(result)) {
          result = [result];
        }
        matched.push.apply(matched, result);
      }
    });

    if ( ! matched.length) {
      return null;
    }
    return mapResult(matched);
  };
  match.matches = function(vtree) {
    return !!selector(vtree);
  }
  return match;
};

function traverse(vtree, fn) {
  fn(vtree);
  if (vtree.children) {
    vtree.children.forEach(function(vtree) {
      traverse(vtree, fn);
    });
  }
}

function mapResult(result) {
  return result.map(function(node){
    return node.vtree;
  });
}

function mapTree(vtree, parent) {
  if (vtree.type === "VirtualText") {
    return {
      contents: vtree.text,
      properties: {},
      parent: parent,
      vtree: vtree,
    };
  }

  var node = {
    tagName: vtree.tagName,
    contents: "",
    properties: vtree.properties || {},
    parent: parent,
    vtree: vtree,
  };
  node.children = vtree.children.map(function(child) {
    return mapTree(child, node);
  });
  return node;
}

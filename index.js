"use strict";

// @TODO text content

var language = require("cssauron")({
  tag: "tagName",
  class: function (node) {
    if (node.className !== undefined) {
      return node.className;
    }
    // html-to-vdom puts the 'class' in attributes.
    if (node.properties && node.properties.attributes) {
      return node.properties.attributes.class;
    }
    return undefined;
  },
  "id" :"id",
  children: "children",
  parent: "parent",
  contents: function(node) {
    return node.contents || "";
  },
  attr: function(node, attr) {
    if (node.properties) {
      var attrs = node.properties.attributes;
      if(attrs && attrs[attr]){
        return attrs[attr];
      }
      return node.properties[attr];
    }
  },
});

module.exports = function(sel, options) {
  options = options || {};
  var selector = language(sel);
  function match(vtree) {
    var node = mapTree(vtree, null, options) || {};
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

    var results = mapResult(matched);
    if (results.length === 0) {
      return null;
    }
    return results;
  }
  match.matches = function(vtree) {
    var node = mapTree(vtree, null, options);
    return !!selector(node);
  };
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
  return result
    .filter(function(node) {
      return !! node.vtree;
    })
    .map(function(node){
      return node.vtree;
    });
}

function getNormalizeCaseFn(caseSensitive) {
  return caseSensitive ?
    function noop(str) {
      return str;
    } :
    function toLowerCase(str) {
      return str.toLowerCase();
    };
}

// Map a virtual-dom node tree into a data structure that cssauron can use to
// traverse.
function mapTree(vtree, parent, options) {
  var normalizeTagCase = getNormalizeCaseFn(options.caseSensitiveTag);

  // VText represents text nodes
  // See https://github.com/Matt-Esch/virtual-dom/blob/master/docs/vtext.md
  if (vtree.type === "VirtualText") {
    return {
      contents: vtree.text,
      parent: parent,
      vtree: vtree,
    };
  }

  if (vtree.tagName != null) {
    var node = {};
    node.parent = parent;
    node.vtree =  vtree;
    node.tagName = normalizeTagCase(vtree.tagName);
    if (vtree.properties) {
      node.properties = vtree.properties;
      if (typeof vtree.properties.className === "string") {
        node.className = vtree.properties.className;
      }
      if (typeof vtree.properties.id === "string") {
        node.id = vtree.properties.id;
      }
    }
    if (vtree.children && typeof vtree.children.map === "function") {
      node.children = vtree.children.map(function(child) {
        return mapTree(child, node, options);
      }).filter(Boolean);
    }
    return node;
  }
}

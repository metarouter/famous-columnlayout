var View       = require('famous/core/View'),
    RenderNode = require('famous/core/RenderNode'),
    Modifier   = require('famous/core/Modifier');

function Cell () {
  View.apply(this, arguments);

  _setupNode.call(this);
}

Cell.prototype = Object.create(View.prototype);
Cell.prototype.constructor = Cell;

Cell.DEFAULT_OPTIONS = {
  // Cell size is measured in number of columns
  // By default, cell spans across one column
  size: 1
};

module.exports = Cell;

Cell.prototype.getColumnSize = function () {
  return this.options.size;
};

function _setupNode () {
  var rootModifier = new Modifier();
  var node = new RenderNode(rootModifier);

  this._rootModifier = rootModifier;
  this._node = node;
}

var View = require('famous/core/View');

function ColumnLayout () {
  View.apply(this, arguments);

  this._items = [];
}

ColumnLayout.prototype = Object.create(View.prototype);
ColumnLayout.prototype.constructor = ColumnLayout;

ColumnLayout.DEFAULT_OPTIONS = {};

module.exports = ColumnLayout;

ColumnLayout.prototype.sequenceFromArray = function (array) {
  array.forEach(_addItem.bind(this));
};

function _addItem (item) {
  var items = this._items;

  items.push(item);
}

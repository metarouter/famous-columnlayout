var View = require('famous/core/View');

function Cell () {
  View.apply(this, arguments);
}

Cell.prototype = Object.create(View.prototype);
Cell.prototype.constructor = Cell;

Cell.DEFAULT_OPTIONS = {
  // Cell size is measured in number of columns
  // By default, cell spans across one column
  size: 1
};

module.exports = Cell;

Cell.prototype.getSize = function () {
  return this.options.size;
};

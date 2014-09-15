var View = require('famous/core/View');

function Cell () {
  View.apply(this, arguments);
}

Cell.prototype = Object.create(View.prototype);
Cell.prototype.constructor = Cell;

Cell.DEFAULT_OPTIONS = {};

module.exports = Cell;

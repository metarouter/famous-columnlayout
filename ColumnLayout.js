var View = require('famous/core/View');

function ColumnLayout () {
  View.apply(this, arguments);
}

ColumnLayout.prototype = Object.create(View.prototype);
ColumnLayout.prototype.constructor = ColumnLayout;

ColumnLayout.DEFAULT_OPTIONS = {};

module.exports = ColumnLayout;

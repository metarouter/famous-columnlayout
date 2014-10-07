var View         = require('famous/core/View'),
    ViewSequence = require('famous/core/ViewSequence');

function ColumnLayout () {
  View.apply(this, arguments);

  this.sequence = null;
}

ColumnLayout.prototype = Object.create(View.prototype);
ColumnLayout.prototype.constructor = ColumnLayout;

ColumnLayout.DEFAULT_OPTIONS = {};

module.exports = ColumnLayout;

ColumnLayout.prototype.sequenceFrom = function (sequence) {
  if (sequence instanceof Array) { sequence = new ViewSequence(sequence); }
  this.sequence = sequence;
};

ColumnLayout.prototype.render = function () {
  return this.sequence.render();
};

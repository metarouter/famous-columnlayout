var OptionsManager = require('famous/core/OptionsManager'),
    Entity         = require('famous/core/Entity'),
    ViewSequence   = require('famous/core/ViewSequence');
var Transitionable = require('famous/transitions/Transitionable');

function ColumnLayout (options) {
  this.options = Object.create(ColumnLayout.DEFAULT_OPTIONS);
  this.optionsManager = new OptionsManager(this.options);
  if (options) {
    this.setOptions(options);
  }

  this.sequence = null;
  this.id = Entity.register(this);
  this._contextSize = new Transitionable([0, 0]);
}

ColumnLayout.DEFAULT_OPTIONS = {
  columnWidth: 320
};

module.exports = ColumnLayout;

ColumnLayout.prototype.render = function () {
  return this.id;
};

ColumnLayout.prototype.commit = function (context) {
  var size           = context.size,
      sizeCache      = this._contextSize.get(),
      sizeHasChanged = (size[0] !== size[0]);

  if (sizeHasChanged) {
    // TODO Reflow
  }

  return [];
};

ColumnLayout.prototype.setOptions = function (options) {
  return this.optionsManager.setOptions(options);
};

ColumnLayout.prototype.sequenceFrom = function (sequence) {
  if (sequence instanceof Array) {
    sequence = new ViewSequence(sequence);
  }
  this.sequence = sequence;
};

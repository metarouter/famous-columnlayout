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
  columnWidth: 320,
  transition: undefined
};

module.exports = ColumnLayout;

ColumnLayout.prototype.render = function () {
  return this.id;
};

ColumnLayout.prototype.commit = function (context) {
  var contextSize    = context.size,
      size           = this._contextSize,
      sizeCache      = size.get(),
      sizeHasChanged = (sizeCache[0] !== contextSize[0]);

  if (sizeHasChanged) {
    size.set([contextSize[0], contextSize[1]], this.options.transition);
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

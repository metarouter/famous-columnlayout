var OptionsManager = require('famous/core/OptionsManager'),
    ViewSequence   = require('famous/core/ViewSequence'),
    Entity         = require('famous/core/Entity');

function ColumnLayout (options) {
  this.options = Object.create(ColumnLayout.DEFAULT_OPTIONS);
  this.optionsManager = new OptionsManager(this.options);
  if (options) {
    this.setOptions(options);
  }

  this.id = Entity.register(this);

  this.sequence = null;
}

ColumnLayout.DEFAULT_OPTIONS = {
  columnWidth: 320,
  singleColumnWidth: undefined
};

module.exports = ColumnLayout;

ColumnLayout.prototype.render = function () {
  return this.id;
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

ColumnLayout.prototype.commit = function (context) {
  var transform = context.transform,
      opacity   = context.opacity,
      origin    = context.origin,
      size      = context.size;
  var result = [];

  return {
    transform: transform,
    opacity: opacity,
    origin: origin,
    size: size,
    target: result
  };
};

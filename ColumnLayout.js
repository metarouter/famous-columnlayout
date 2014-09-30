var OptionsManager = require('famous/core/OptionsManager'),
    Entity         = require('famous/core/Entity');

function ColumnLayout (options) {
  this.options = Object.create(ColumnLayout.DEFAULT_OPTIONS);
  this.optionsManager = new OptionsManager(this.options);
  if (options) {
    this.setOptions(options);
  }

  this.id = Entity.register(this);
}

ColumnLayout.DEFAULT_OPTIONS = {};

module.exports = ColumnLayout;

ColumnLayout.prototype.render = function () {
  return this.id;
};

ColumnLayout.prototype.setOptions = function (options) {
  return this.optionsManager.setOptions(options);
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

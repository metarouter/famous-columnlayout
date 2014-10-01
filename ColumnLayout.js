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
  this._cache = {
    size: [0, 0]
  };
  this._modifiers = [];
  this._states = [];
  this._numOfColumns = 0;
}

ColumnLayout.DEFAULT_OPTIONS = {
  columnWidth: 320
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
  var cache     = this._cache,
      sizeCache = cache.size;
  var result = [];

  var sizeChanged = (sizeCache[0] !== size[0] || sizeCache[1] !== size[1]);
  if (sizeChanged) {
    _reflow.call(this, size);
  }

  return {
    transform: transform,
    opacity: opacity,
    origin: origin,
    size: size,
    target: result
  };
};

function _reflow (size) {
  var cache = this._cache;
  var sequence = this.sequence;
  var opts = this.options;
  var width = size[0];

  this._numOfColumns = ~~(width / opts.columnWidth);

  cache.size = [size[0], size[1]];
}

function forEachSequence (sequence, cb) {
  while (sequence) {
    var item = sequence.get(),
        idx  = sequence.getIndex();

    cb(item, idx, sequence);
    sequence = sequence.getNext();
  }
}

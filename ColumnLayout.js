var View         = require('famous/core/View'),
    Modifier     = require('famous/core/Modifier'),
    Transform    = require('famous/core/Transform'),
    Entity       = require('famous/core/Entity'),
    ViewSequence = require('famous/core/ViewSequence');
var Transitionable          = require('famous/transitions/Transitionable'),
    TransitionableTransform = require('famous/transitions/TransitionableTransform');

var NULL_CELL = [0, 0];

function ColumnLayout () {
  View.apply(this, arguments);

  this.id = Entity.register(this);
  this.sequence = null;
  this._cellHeight = [];
  this._initialized = false;
  this._contextSize = [0, 0];
  this._modifiers = [];
  this._states = [];
}

ColumnLayout.prototype = Object.create(View.prototype);
ColumnLayout.prototype.constructor = ColumnLayout;

ColumnLayout.DEFAULT_OPTIONS = {
  columnWidth: 320,
  transition: undefined
};

module.exports = ColumnLayout;

ColumnLayout.prototype.sequenceFrom = function (sequence) {
  if (sequence instanceof Array) { sequence = new ViewSequence(sequence); }
  this.sequence = sequence;
  this._cellHeight = [];
};

ColumnLayout.prototype.render = function () {
  return this.id;
};

ColumnLayout.prototype.commit = function (context) {
  var widthChanged = (this._contextSize[0] !== context.size[0]);

  if (this._initialized && widthChanged) {
    this.reflow(context.size);
    this._contextSize = [context.size[0], context.size[1]];
  }

  var res = iterateSequence(this.sequence, function (item, index) {
    if ( !this._states[index] && !this._modifiers[index] ) {
      createModifier.call(this, index, [0, 0, 0], context.size);
    }

    return this._modifiers[index].modify({
      origin: context.origin,
      target: item.render()
    });
  }.bind(this));

  this._initialized = true;
  return {
    transform: context.transfom,
    opacity: context.opacity,
    target: res
  };
};

ColumnLayout.prototype.reflow = function (size) {
  size = size || this._contextSize;

  var states = this._states;
  var transition = this.options.transition;

  var width = size[0];
  var columns = ~~(width / this.options.columnWidth);
  var columnWidth = width / columns;
  var columnHeights = fillArray([], 0, columns);

  iterateSequence(this.sequence, function (item, index) {
    var state = states[index];
    var itemHeight = (item.getSize(true) || NULL_CELL)[1];
    var column = minArrayIndex(columnHeights);
    var xPos = column * columnWidth,
        yPos = columnHeights[column];

    columnHeights[column] += itemHeight;
    this._cellHeight[index] = itemHeight;

    state.size.halt();
    state.transform.halt();

    state.size.set([columnWidth, state.size.get()[1]], transition);
    state.transform.setTranslate([xPos, yPos], transition);
  }.bind(this));
};

function createModifier (index, position, contextSize) {
  var state = {
    size: new Transitionable([this.options.columnWidth, true]),
    transform: new TransitionableTransform(Transform.translate.apply(null, position))
  };
  var modifier = new Modifier({
    size: function () {
      var size = this.sequence._.array[index].getSize(true) || NULL_CELL;
      if (size[1] !== this._cellHeight[index] && this._initialized) {
        this.reflow(contextSize);
      }
      return state.size.get();
    }.bind(this),
    transform: state.transform
  });

  this._states[index] = state;
  this._modifiers[index] = modifier;
}

function minArrayIndex (array) {
  var length = array.length,
      index  = 0,
      min, i;

  for (i = 0; i < length; i++) {
    if (i === 0) { min = array[i]; continue; }
    if (array[i] < min) {
      min = array[i];
      index = i;
    }
  }
  return index;
}

function fillArray (array, value, length) {
  var i;
  length = length || array.length;

  for (i = 0; i < length; i++) {
    array[i] = value;
  }

  return array;
}

function iterateSequence (sequence, cb) {
  var result = [];
  while (sequence) {
    var item = sequence.get(),
        idx  = sequence.getIndex();

   result.push(cb.call(this, item, idx, sequence));
   sequence = sequence.getNext();
  }
  return result;
}

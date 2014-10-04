var OptionsManager = require('famous/core/OptionsManager'),
    Entity         = require('famous/core/Entity'),
    Modifier       = require('famous/core/Modifier'),
    Transform      = require('famous/core/Transform'),
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
  this._modifiers = [];
  this._positions = [];
  this._contextSize = new Transitionable([0, 0]);
}

ColumnLayout.DEFAULT_OPTIONS = {
  defaultCellColumnSize: 1,
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

  var result = forEachSequenceItem(this.sequence, function (item, index) {
    var modifier = this._modifiers[index];

    if (! modifier) return {};
    return modifier.modify({
      target: item.render()
    });
  }.bind(this));

  return result;
};

ColumnLayout.prototype.setOptions = function (options) {
  return this.optionsManager.setOptions(options);
};

ColumnLayout.prototype.sequenceFrom = function (sequence) {
  if (sequence instanceof Array) {
    sequence = new ViewSequence(sequence);
  }
  this.sequence = sequence;

  createLayout.call(this);
};

function createLayout () {
  var sequence = this.sequence;

  forEachSequenceItem(sequence, function () {
    createModifier.apply(this, arguments);
    positionItemInLayout.apply(this, arguments);
  }.bind(this));
}

function positionItemInLayout (item, index, previousItem) {
  var opts = this.options;

  var modifier       = this._modifiers[index],
      cellColumnSize = (item.getCellColumnSize ?
                        item.getCellColumnSize() :
                        opts.defaultCellColumnSize);

  modifier.sizeFrom(cellSize.bind(this, item, index, cellColumnSize));
  modifier.transformFrom(cellPosition.bind(this, index, previousItem));
}

function calcColumns (contextWidth, columnWidth) {
  var columns = ~~(contextWidth / columnWidth);

  return {
    columns: columns,
    columnWidth: (contextWidth / columns)
  };
}

function cellPosition (index) {
  var size    = this._contextSize.get(),
      columns = calcColumns(size[0], this.options.columnWidth);
  var xPos = (index % columns.columns) * columns.columnWidth;
  var yPos = 0;
  var prevIndex = index - columns.columns;
  var cellInfo = this._positions[index];

  if (prevIndex >= 0) {
    var previousCellInfo = this._positions[prevIndex];
    yPos = previousCellInfo.size[1] + previousCellInfo.y;
  }

  cellInfo.x = xPos;
  cellInfo.y = yPos;

  return Transform.translate(xPos, yPos);
}

function cellSize (item, index, cellColumnSize) {
  var size    = this._contextSize.get(),
      trueSize = item.getSize(true) || [0, 0],
      columns = calcColumns(size[0], this.options.columnWidth);

  var cellWidth = columns.columnWidth * cellColumnSize;

  var cellInfo = this._positions[index];
  cellInfo.size = [cellWidth, trueSize[1]];

  return [cellWidth, size[1]];
}

function createModifier (item, index) {
  if (! this._modifiers[index]) {
    this._modifiers[index] = new Modifier();
  }
  if (! this._positions[index]) {
    this._positions[index] = {};
  }
}

function forEachSequenceItem (sequence, cb) {
  var previousItem = null;
  var result = [];

  while (sequence) {
    var item = sequence.get(),
        index = sequence.getIndex();

    result.push(cb(item, index, previousItem, sequence));
    sequence = sequence.getNext();
    previousItem = item;
  }

  return result;
}

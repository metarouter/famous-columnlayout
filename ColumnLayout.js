var OptionsManager = require('famous/core/OptionsManager'),
    Entity         = require('famous/core/Entity'),
    Modifier       = require('famous/core/Modifier'),
    Transform      = require('famous/core/Transform'),
    ViewSequence   = require('famous/core/ViewSequence');

var NULL_CELL_SIZE = [0, 0];

function ColumnLayout (options) {
  this.options = Object.create(ColumnLayout.DEFAULT_OPTIONS);
  this.optionsManager = new OptionsManager(this.options);
  if (options) {
    this.setOptions(options);
  }

  this.sequence = null;
  this.id = Entity.register(this);
  this._modifiers = [];
  this._cells = [];
  this._contextSize = [0, 0];
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
      sizeCache      = this._contextSize,
      sizeHasChanged = (sizeCache[0] !== contextSize[0]);

  if (sizeHasChanged) {
    this._contextSize = [contextSize[0], contextSize[1]];
    reflow.call(this);
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
  this._cells = [];

  createLayout.call(this);
};

function reflow () {
  var cells = this._cells,
      size  = this._contextSize;
  var columnInfo = calcColumns(size[0], this.options.columnWidth);

  if (columnInfo.columns === 0) {
    return;
  }
  var columns = [];
  var columnsHeight = fillArray([], 0, columnInfo.columns);

  for (var i = 0; i < columnInfo.columns; i++) {
    columns[i] = [];
  }

  cells.forEach(function (cellInfo, index) {
    cellInfo.size = cellInfo.size || NULL_CELL_SIZE;

    var columnIndex = minIndex(columnsHeight),
        column      = columns[columnIndex],
        cellSize    = cellInfo.size;

    if (column.length > 0) {
      cellInfo.previous = column[column.length - 1];
    } else {
      delete cellInfo.previous;
    }
    column.push(index);
    columnsHeight[columnIndex] += cellSize[1];
    cellInfo.column = columnIndex;
  });
}

function fillArray (array, val, length) {
  length = length || array.length;

  for (var i = 0; i < length; i++) {
    array[i] = val;
  }
  return array;
}

function minIndex (array) {
  var index = -1;
  var min = 0;

  for (var i = 0; i < array.length; i++) {
    if (i === 0) { min = array[i]; index = i; continue; }

    if (array[i] < min) {
      min = array[i];
      index = i;
    }
  }
  return index;
}

function createLayout () {
  var sequence = this.sequence;

  forEachSequenceItem(sequence, function () {
    createModifier.apply(this, arguments);
    positionItemInLayout.apply(this, arguments);
  }.bind(this));
}

function positionItemInLayout (item, index, previousItem) {
  if (! item) { return; }

  var opts = this.options;

  var modifier       = this._modifiers[index],
      cellColumnSize = (item.getCellColumnSize ?
                        item.getCellColumnSize() :
                        opts.defaultCellColumnSize);

  var cellInfo = this._cells[index];
  modifier.sizeFrom(cellSize.bind(this, item, cellInfo, cellColumnSize));
  modifier.transformFrom(cellPosition.bind(this, cellInfo));
}

function calcColumns (contextWidth, columnWidth) {
  var columns = ~~(contextWidth / columnWidth);

  return {
    columns: columns,
    columnWidth: (contextWidth / columns)
  };
}

function cellPosition (cellInfo) {
  var size       = this._contextSize,
      columnInfo = calcColumns(size[0], this.options.columnWidth);
  var previousY      = 0,
      previousHeight = 0,
      previous       = this._cells[cellInfo.previous];

  if (previous && previous.y) previousY = previous.y;
  if (previous && previous.size) previousHeight = previous.size[1];

  var xPos = (cellInfo.column % columnInfo.columns) * columnInfo.columnWidth;
  var yPos = previousY + previousHeight;

  cellInfo.x = xPos;
  cellInfo.y = yPos;


  return Transform.translate(xPos, yPos);
}

function cellSize (item, cellInfo, cellColumnSize) {
  var size       = this._contextSize,
      trueSize   = item.getSize(true) || NULL_CELL_SIZE,
      columnInfo = calcColumns(size[0], this.options.columnWidth);

  var cellWidth = columnInfo.columnWidth * cellColumnSize;

  cellInfo.size = cellInfo.size || NULL_CELL_SIZE;
  if (trueSize[1] !== cellInfo.size[1]) {
    setTimeout(reflow.bind(this), 1);
  }
  cellInfo.size = [cellWidth, trueSize[1]];

  return [cellWidth, size[1]];
}

function createModifier (item, index) {
  if (! this._modifiers[index]) {
    this._modifiers[index] = new Modifier();
  }
  if (! this._cells[index]) {
    this._cells[index] = {
      index: index,
      column: index
    };
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

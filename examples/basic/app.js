var Engine = require('famous/core/Engine');
var Surface = require('famous/core/Surface');

var ColumnLayout = require('../../ColumnLayout');
var Cell         = require('../../Cell');

var mainContext = Engine.createContext();
var surface = new Surface({
  content: 'Hello, world',
  properties: {
    backgroundColor: 'lightblue'
  }
});
var cell = new Cell();
var cells = [cell];
var layout = new ColumnLayout();

cell.add(surface);
layout.sequenceFromArray(cells);

mainContext.add(layout);


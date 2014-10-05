var Engine = require('famous/core/Engine');
var Surface = require('famous/core/Surface');

var ColumnLayout = require('../../ColumnLayout');

var mainContext = Engine.createContext();
var surface = new Surface({
  content: 'Hello, world',
  size: [undefined, true],
  properties: {
    backgroundColor: 'lightblue'
  }
});
var surface_2 = new Surface({
  content: 'Surface 2',
  size: [undefined, true],
  properties: {
    backgroundColor: 'lightgreen',
    fontSize: '5rem'
  }
});
var surface_3 = new Surface({
  content: 'Surface 3',
  size: [undefined, true],
  properties: {
    backgroundColor: 'lightyellow',
    fontSize: '2rem'
  }
});
var surface_4 = new Surface({
  content: 'Surface 4',
  size: [undefined, true],
  properties: {
    backgroundColor: 'orange',
    fontSize: '5rem'
  }
});
//surface_3.getCellColumnSize = function () { return 2; };
var cells = [surface, surface_2, surface_3, surface_4];
var layout = new ColumnLayout({
});
window.layout = layout;

layout.sequenceFrom(cells);

mainContext.add(layout);


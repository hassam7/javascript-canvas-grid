# 2D Canvas Grid

This repository contains code for 2D Canvas Grid. It's a class which can be used to create `Grid` on html canvas. The grid consist of `GridCell` which can be accessed via api provided by `Grid` class and can be manipulated.

The motivation behind `2D Canvas Grid` is to provide a way to implement and visualize algorithms like Depth First Search, Breadth First Search, Flood Fill, Maze Generation, Maze Path Finding  without getting stuck into writing the visualization code. Instead `2D Canvas Grid` provides simple to use api which abstracts Canvas in `Grid` and `GridCell` These can be use to draw over the canvas.

## Flood Fill Demo Gif

![alt text](https://raw.githubusercontent.com/hassam7/javascript-canvas-grid/master/flood-fill.gif)

## Flood Fill Example
```
function floodFill(g: Grid, griCell: GridCell) {
  setTimeout(() => {
    const neighbours: GridCell[] = g.getNeighbours(griCell, false, false, true);
    if (neighbours.length != 0) {
      neighbours.forEach(n => {
        g.set(n.row, n.col, { ...n, fillColor: 'rgba(0,0,0,0.5)', isPassable: false }, true);
        floodFill(g, n);
      });
    }
  }, 200);
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvasHtmlElement: HTMLCanvasElement = document.createElement('canvas');
  canvasHtmlElement.width = width;
  canvasHtmlElement.height = height;
  return canvasHtmlElement;
}

document.body.append(canvasHtmlElement);
const g = new Grid(400, 40, canvasHtmlElement);
floodFill(g, {row:2, col: 2});
```
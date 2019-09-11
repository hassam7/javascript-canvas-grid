import './style.css';
import Grid, { GridCell } from './grid';

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvasHtmlElement: HTMLCanvasElement = document.createElement('canvas');
  canvasHtmlElement.width = width;
  canvasHtmlElement.height = height;
  return canvasHtmlElement;
}

const canvasHtmlElement: HTMLCanvasElement = createCanvas(500, 500);
function main() {
  document.body.append(canvasHtmlElement);
  const g = new Grid(400, 40, canvasHtmlElement);
  g.onCellClick = (e, m) => {
    console.log(e.row, e.col);
    if (m.altKey) {
      g.set(e.row, e.col, { ...e, fillColor: 'rgba(255, 0, 0, 0.5)', isPassable: false }, true);
    } else {
      g.set(e.row, e.col, { ...e, fillColor: 'rgba(0, 0, 0, .5)', isPassable: true }, true);
    }
  }
  (window as any).g = g;
}

main();
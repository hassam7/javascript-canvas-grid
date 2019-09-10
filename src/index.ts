import './style.css';
import Grid, { GridCell } from './grid';

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvasHtmlElement: HTMLCanvasElement = document.createElement('canvas');
  canvasHtmlElement.width = width;
  canvasHtmlElement.height = height;
  return canvasHtmlElement;
}

// (window as any).floodFill = function floodFill(g: Grid, griCell: GridCell) {
//   setTimeout(() => {
//     const neighbours: GridCell[] = g.getNeighbours(griCell, false, false, true);
//     if (neighbours.length != 0) {
//       neighbours.forEach(n => {
//         g.set(n.row, n.col, { ...n, fillColor: 'rgba(0,0,0,0.5)', isPassable: false }, true);
//         floodFill(g, n);
//       });
//     }
//     console.log('timeout')
//   }, 200);
// }

// (window as any).floodFillStack = function floodFillStack(g: Grid, gridCell: GridCell) {
//   const stack: GridCell[] = [];
//   stack.push(gridCell);
//   while (stack.length != 0) {
//     const currentGridCell = stack.pop();
//     if (!currentGridCell.visited) {
//       g.set(currentGridCell.row, currentGridCell.col, { ...currentGridCell, visited: true, fillColor: 'red' }, true);
//       g.getNeighbours(currentGridCell, false, true, true).forEach((gc: GridCell) => {
//         stack.push(gc);
//       });
//     }
//   }
// }


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
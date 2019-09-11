import Grid, { GridCell } from "./grid";

export const floodFill = function floodFill(g: Grid, griCell: GridCell) {
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

export const floodFillStack = function floodFillStack(g: Grid, gridCell: GridCell) {
  const stack: GridCell[] = [];
  stack.push(gridCell);
  while (stack.length != 0) {
    const currentGridCell = stack.pop();
    if (!currentGridCell.visited) {
      g.set(currentGridCell.row, currentGridCell.col, { ...currentGridCell, visited: true, fillColor: 'red' }, true);
      g.getNeighbours(currentGridCell, false, true, true).forEach((gc: GridCell) => {
        stack.push(gc);
      });
    }
  }
}

interface GridCell {
  id: number;
  col: number;
  row: number;
  visited: boolean;
  open: boolean;
  toString: () => string;
  color?: string;
}

class Grid {

  private context: CanvasRenderingContext2D;
  private cellSize: number;
  private gridSize: number;
  private _grid: Array<Array<GridCell>> = [];

  private totalColums: number;
  private totalRows: number;

  private openColor: string = 'white';
  private closedColor: string = 'black';
  private canvasElement: HTMLCanvasElement;

  private canvasClickCallback: (gridCell: GridCell, e: MouseEvent) => void = null;

  constructor(gridSize: number = 600, cellSize: number = 20, canvasElement: HTMLCanvasElement) {
    this.cellSize = cellSize;
    this.gridSize = gridSize;
    this.canvasElement = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.totalColums = Math.round(this.gridSize / this.cellSize);
    this.totalRows = Math.round(this.gridSize / this.cellSize);
    this.attachClickEventListener()

  }

  public at(col: number, row: number): GridCell {
    return this._grid[col][row];
  }

  // public set(gridCell: GridCell) {
  //   const cell = this.at(gridCell.col, gridCell.row);
  //   Object.assign(cell, gridCell);
  // }

  public set(col: number, row: number, gridCell: Partial<GridCell> = {}): void {
    const gridCellCurrent: GridCell = this.at(col, row);
    Object.assign(gridCellCurrent, gridCell);
    this.redrawAt(gridCellCurrent);
  }

  public initGridCells(callback: (col: number, row: number, counter: number) => GridCell) {
    let counter = 0;
    for (let col = 0; col < this.totalColums; col++) {
      this._grid[col] = [];
      for (let row = 0; row < this.totalRows; row++) {
        const defaultGridCell: GridCell = { id: counter, col, row, visited: false, open: true };
        if (callback) {
          this._grid[col][row] = callback(col, row, counter) || defaultGridCell;
        }
        else this._grid[col][row] = defaultGridCell;
        counter++;
      }
    }
  }

  public setCanvasClickCallback(callback: (gridCell: GridCell, e: MouseEvent) => void): void {
    this.canvasClickCallback = callback;
  }

  public unsetCanvasClickCallback(): void {
    this.canvasClickCallback = null;
  }

  public attachClickEventListener() {
    // Fix memory leak
    this.canvasElement.addEventListener('click', this.onCanvasClick.bind(this));
  }

  public removeClickEventListener() {
    this.canvasElement.removeEventListener('click', this.onCanvasClick);
  }

  public onCanvasClick(e: MouseEvent) {
    let x = e.pageX;
    let y = e.pageY;
    x -= this.canvasElement.offsetLeft;
    y -= this.canvasElement.offsetTop;
    const coords: { x: number, y: number } = this.canvasToGrid({ x, y });
    const gridCell = this.at(coords.y, coords.x);
    if (this.canvasClickCallback) this.canvasClickCallback(gridCell, e);
    return coords;
  }

  public drawGrid() {
    if (!this.context) throw new Error("Please provide canvas context");
    let counter = 0;
    for (let col = 0; col < this.totalColums; col++) {
      for (let row = 0; row < this.totalRows; row++) {
        this.drawRect(col, row);
        this.drawText(col, row, `${counter}`);
        counter++;
      }
      // emit an event here
    }
  }

  public redrawAt(gridCell: Partial<GridCell>) {
    const temp = this.at(gridCell.col, gridCell.row);
    Object.assign(temp, gridCell);
    this._drawCell(temp);
  }

  public drawAllCells(
    openColor: string = this.openColor,
    closedColor: string = this.closedColor,
    callback: (col: number, row: number, counter: number, gridCell: GridCell, context: CanvasRenderingContext2D)
      => void = null) {
    let counter = 0;
    for (let col = 0; col < this.totalColums; col++) {
      for (let row = 0; row < this.totalRows; row++) {
        if (callback) callback(col, row, counter, this._grid[col][row], this.context)
        else {
          const gridCell: GridCell = this.at(col, row);
          this._drawCell(gridCell, openColor, closedColor);
        }
        counter++;
      }
      // emit an event here
    }
  }

  public generateNeighbourCoordinates(x: number, y: number, includeDiagonal: boolean = false): Array<[number, number]> {

    const right: [number, number] = [y + 1, x];
    const left: [number, number] = [y - 1, x];

    const top: [number, number] = [y, x - 1,];
    const bottom: [number, number] = [y, x + 1];

    const topRight: [number, number] = [y + 1, x - 1];
    const bottomRight: [number, number] = [y + 1, x + 1,];

    const topLeft: [number, number] = [y - 1, x - 1]
    const bottomLeft: [number, number] = [y - 1, x + 1]
    /*
        [1,2,3] [(0,0),(0,1),(0,2)]
        [4,5,6] [(1,0),(1,1),(1,2)]
        [7,8,0] [(2,0),(2,1),(2,2)]
    */
    const diagonals = [topRight, bottomRight, topLeft, bottomLeft]
    return [right, left, top, bottom, ...(includeDiagonal ? diagonals : [])]
      .filter(([a, b]) => a >= 0 && b >= 0)
      .filter(([a, b]) => a < this.totalColums && b < this.totalRows)
      .filter(([a, b]) => this.at(a, b).open === true)
      ;
  }

  private canvasToGrid(e: { x: number, y: number }) {
    let x = Math.floor(e.x / this.cellSize);
    let y = Math.floor(e.y / (this.cellSize));
    if ((x >= 0 && y >= 0) && (x < this.totalRows && y < this.totalRows)) {
      return { x, y };
    }
    else return null
  }

  private _drawCell(gridCell: GridCell, openColor = this.openColor, closedColor = this.closedColor) {
    if (gridCell.color) {
      this.fillRect(gridCell.col, gridCell.row, gridCell.color);
    } else {
      if (gridCell.open) this.fillRect(gridCell.col, gridCell.row, openColor);
      else this.fillRect(gridCell.col, gridCell.row, closedColor);
    }
  }

  private fillRect(col: number, row: number, fillStyle: string = 'rgba(0,0,0,0.5)') {
    const fillStyleDefault = this.context.fillStyle;
    this.context.fillStyle = fillStyle;
    this.context.fillRect(
      (this.cellSize * row),
      (this.cellSize * col),
      this.cellSize,
      this.cellSize,
    );
    this.context.fillStyle = fillStyleDefault;
  }


  private drawRect(col: number, row: number, strokeColor: string = 'black') {
    const strokeDefaultColor = this.context.strokeStyle;
    this.context.strokeStyle = strokeColor;
    this.context.beginPath();
    this.context.rect(
      (this.cellSize * row),
      (this.cellSize * col),
      this.cellSize,
      this.cellSize,
    );
    this.context.stroke();
    this.context.strokeStyle = strokeDefaultColor;
  }

  private drawText(col: number, row: number, text: string, style: string = 'black') {
    this.context.font = "10px Arial";
    const fillStyle = this.context.fillStyle;
    this.context.fillStyle = style;
    this.context.fillText(`${text}`,
      ((this.cellSize) * row) + 10,
      ((this.cellSize) * col) + 20,
    );
    this.context.fillStyle = fillStyle;
  }
}

export default Grid;
export class GridCell {
  constructor(public id: number,
    public row: number,
    public col: number,
    public visited: boolean = false,
    public isPassable: boolean = true,
    public fillColor: string = null,
    public strokeColor: string = null
  ) { }

  public get color(): string {
    if (this.fillColor) return this.fillColor;
    else return this.strokeColor;
  }

  toString(): string {
    return `${this.id}`;
  }
}
class Grid {
  private gridSize: number; //Size of overall grid in pixel
  private cellSize: number; //Size of individual cell in pixel
  private canvasElement: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private cols: number;
  private rows: number
  public onCellClick: (gridCell: GridCell, e: MouseEvent) => void;

  private _grid: Array<Array<GridCell>> = [];

  constructor(gridSize: number, cellSize: number, canvasElement: HTMLCanvasElement) {
    this.gridSize = gridSize;
    this.cellSize = cellSize;
    this.canvasElement = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.rows = Math.round(this.gridSize / this.cellSize);
    this.cols = Math.round(this.gridSize / this.cellSize);
    this.initGrid();
    this.drawCells();
  }

  public get(row: number, col: number): GridCell {
    return this._grid[row][col];
  }

  public set(row: number, col: number, gridCell: Partial<GridCell>, redrawCell: boolean = false): GridCell {
    const oldGridCell = this._grid[row][col];
    const newGirdCell: GridCell = Object.assign(oldGridCell, gridCell);
    if (redrawCell) this.redrawCell(newGirdCell);
    return newGirdCell;
  }

  public initGrid(): void {
    let counter = 0;
    for (let row = 0; row < this.rows; row++) {
      this._grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this._grid[row][col] = new GridCell(counter++, row, col, false, true);
      }
    }

    this.canvasElement.addEventListener('click', (e: MouseEvent) => {
      let x = e.pageX;
      let y = e.pageY;
      x -= this.canvasElement.offsetLeft;
      y -= this.canvasElement.offsetTop;
      const coords: { row: number, col: number } = this.canvasToGrid({ x, y });
      const gridCell = this.get(coords.row, coords.col);
      if (this.onCellClick) this.onCellClick(gridCell, e);
    })
  }

  public drawCells() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const gridCell: GridCell = this._grid[row][col];
        this.drawRect(gridCell.row, gridCell.col, 'red');
        this.drawText(row, col, `${gridCell.id}`);
      }
    }
  }

  public getNeighbours(gridCell: Pick<GridCell, 'row' | 'col'>,
    includeDiagonals: boolean = false,
    excludeVisitedNeighbours: boolean = false,
    excludeClosedNeighbours: boolean = false) {
    const x = gridCell.row;
    const y = gridCell.col;

    const top: [number, number] = [x - 1, y];
    const right: [number, number] = [x, y + 1];
    const bottom: [number, number] = [x + 1, y];
    const left: [number, number] = [x, y - 1];

    const topRight: [number, number] = [x - 1, y + 1];
    const bottomRight: [number, number] = [x + 1, y + 1];

    const topLeft: [number, number] = [x - 1, y - 1]
    const bottomLeft: [number, number] = [x + 1, y - 1]

    return [top, right, bottom, left, ...(includeDiagonals ? [topRight, bottomRight, bottomLeft, topLeft] : [])]
      .filter(([row, col]: [number, number]) => {
        return row >= 0 && col >= 0 && row < this.rows && col < this.cols;
      })
      .map(([row, col]: [number, number]) => {
        return this.get(row, col);
      })
      .filter((gridCell: GridCell) => {
        if (excludeVisitedNeighbours) return !gridCell.visited;
        else return true;
      })
      .filter((gridCell: GridCell) => {
        if (excludeClosedNeighbours) return gridCell.isPassable;
        else return true;
      })
    /*
        [1,2,3] [(0,0),(0,1),(0,2)]
        [4,5,6] [(1,0),(1,1),(1,2)]
        [7,8,0] [(2,0),(2,1),(2,2)]
    */
  }

  private redrawCell(gridCell: GridCell) {
    const isFilled = gridCell.fillColor !== null;
    if (isFilled) this.fillRect(gridCell.row, gridCell.col, gridCell.color)
    else this.drawRect(gridCell.row, gridCell.col, gridCell.color);

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


  private drawRect(row: number, col: number, strokeColor: string = 'black') {
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

  private canvasToGrid(e: { x: number, y: number }) {
    let x = Math.floor(e.x / this.cellSize);
    let y = Math.floor(e.y / (this.cellSize));
    if ((x >= 0 && y >= 0) && (x < this.rows && y < this.cols)) {
      return { row: y, col: x };
    }
    else return null
  }
}

export default Grid;
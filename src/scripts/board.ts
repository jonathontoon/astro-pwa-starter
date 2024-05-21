import Tile from "@scripts/tile.ts";
import * as Helpers from "@scripts/helpers.ts";
import { Direction, Sprite } from "@scripts/enums.ts";

interface BoardProps {
	tileSize: number;
	gridSize: number;
	width: number;
	height: number;
}

interface DetonationCallback {
	(numberOfTiles: number): void;
}

class Board {
	private rowLength: number;
	private columnLength: number;

	private tileSize: number;
	private tileSprites: Sprite[];

	private tileBoard: Tile[][];
	private detonatedTiles: Tile[];

	private centerX: number;
	private centerY: number;

	constructor({ tileSize, gridSize, width, height }: BoardProps) {
		this.rowLength = gridSize;
		this.columnLength = gridSize;

		this.tileSize = tileSize;
		this.tileSprites = [
			Sprite.Enemy,
			Sprite.Health,
			Sprite.Bomb,
			Sprite.Wall,
			Sprite.Coin
		];

		this.tileBoard = [];
		this.detonatedTiles = [];

		this.centerX = Math.round(width / 2 - (this.tileSize * this.rowLength) / 2);
		this.centerY = Math.round(
			height / 2 - (this.tileSize * this.columnLength) / 2
		);

		this.create();
	}

	private create(): void {
		for (let row = 0; row < this.rowLength; row++) {
			this.tileBoard[row] = [];
			for (let column = 0; column < this.columnLength; column++) {
				const tile: Tile = new Tile({
					x: column,
					y: row,
					size: this.tileSize,
					sprite: Sprite.Empty
				});
				this.tileBoard[row].push(tile);
			}
		}

		this.addTile();
	}

	private removeTile(row: number, column: number): void {
		this.tileBoard[row][column].sprite = Sprite.Empty;
	}

	private moveTile(
		row: number,
		column: number,
		toRow: number,
		toColumn: number
	): void {
		this.tileBoard[toRow][toColumn].sprite = this.tileBoard[row][column].sprite;
		this.removeTile(row, column);
	}

	private setForDetonation(
		row: number,
		column: number,
		toRow: number,
		toColumn: number
	): void {
		if (this.tileBoard[row][column].isBomb()) {
			this.detonatedTiles.push(this.tileBoard[toRow][toColumn]);
		}

		this.removeTile(row, column);
	}

	private getEmptyTiles(): Tile[] {
		const emptyTiles: Tile[] = [];
		for (let row = 0; row < this.rowLength; row++) {
			for (let column = 0; column < this.columnLength; column++) {
				if (this.tileBoard[row][column].isEmpty()) {
					emptyTiles.push(this.tileBoard[row][column]);
				}
			}
		}
		return emptyTiles;
	}

	private shiftLeft(): void {
		for (let row = 0; row < this.rowLength; row++) {
			for (let column = 1; column < this.columnLength; column++) {
				if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row][column - 1].isEmpty()
				) {
					this.moveTile(row, column, row, column - 1);
				} else if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row][column - 1].isSprite(
						this.tileBoard[row][column].sprite
					)
				) {
					this.setForDetonation(row, column, row, column - 1);
				}
			}
		}
	}

	private shiftUp(): void {
		for (let row = 1; row < this.rowLength; row++) {
			for (let column = 0; column < this.columnLength; column++) {
				if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row - 1][column].isEmpty()
				) {
					this.moveTile(row, column, row - 1, column);
				} else if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row - 1][column].isSprite(
						this.tileBoard[row][column].sprite
					)
				) {
					this.setForDetonation(row, column, row - 1, column);
				}
			}
		}
	}

	private shiftRight(): void {
		for (let row = 0; row < this.rowLength; row++) {
			for (let column = this.columnLength - 2; column >= 0; column--) {
				if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row][column + 1].isEmpty()
				) {
					this.moveTile(row, column, row, column + 1);
				} else if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row][column + 1].isSprite(
						this.tileBoard[row][column].sprite
					)
				) {
					this.setForDetonation(row, column, row, column + 1);
				}
			}
		}
	}

	private shiftDown(): void {
		for (let row = this.rowLength - 2; row >= 0; row--) {
			for (let column = 0; column < this.columnLength; column++) {
				if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row + 1][column].isEmpty()
				) {
					this.moveTile(row, column, row + 1, column);
				} else if (
					!this.tileBoard[row][column].isEmpty() &&
					this.tileBoard[row + 1][column].isSprite(
						this.tileBoard[row][column].sprite
					)
				) {
					this.setForDetonation(row, column, row + 1, column);
				}
			}
		}
	}

	private addTile(): void {
		const emptyTiles: Tile[] = this.getEmptyTiles();
		const randomSprite: Sprite = Helpers.getRandomItemFromArray(
			this.tileSprites
		) as Sprite;
		const tile: Tile = Helpers.getRandomItemFromArray(emptyTiles) as Tile;
		if (tile) {
			this.tileBoard[tile.y][tile.x].sprite = randomSprite;
		}
	}

	public handleDetonations(callback: DetonationCallback): void {
		if (this.detonatedTiles.length > 0) {
			callback(this.detonatedTiles.length);
		}

		for (let i = 0; i < this.detonatedTiles.length; i++) {
			this.removeTile(this.detonatedTiles[i].y, this.detonatedTiles[i].x);

			if (
				this.detonatedTiles[i].y - 1 >= 0 &&
				!this.tileBoard[this.detonatedTiles[i].y - 1][
					this.detonatedTiles[i].x
				].isEmpty()
			) {
				this.removeTile(this.detonatedTiles[i].y - 1, this.detonatedTiles[i].x);
			}

			if (
				this.detonatedTiles[i].y + 1 < this.rowLength &&
				!this.tileBoard[this.detonatedTiles[i].y + 1][
					this.detonatedTiles[i].x
				].isEmpty()
			) {
				this.removeTile(this.detonatedTiles[i].y + 1, this.detonatedTiles[i].x);
			}

			if (
				this.detonatedTiles[i].x - 1 >= 0 &&
				!this.tileBoard[this.detonatedTiles[i].y][
					this.detonatedTiles[i].x - 1
				].isEmpty()
			) {
				this.removeTile(this.detonatedTiles[i].y, this.detonatedTiles[i].x - 1);
			}

			if (
				this.detonatedTiles[i].x + 1 < this.columnLength &&
				!this.tileBoard[this.detonatedTiles[i].y][
					this.detonatedTiles[i].x + 1
				].isEmpty()
			) {
				this.removeTile(this.detonatedTiles[i].y, this.detonatedTiles[i].x + 1);
			}
		}

		this.detonatedTiles = [];
	}

	public shift(direction: Direction, callback: DetonationCallback): void {
		if (direction === Direction.Up) {
			this.shiftUp();
		}

		if (direction === Direction.Down) {
			this.shiftDown();
		}

		if (direction === Direction.Left) {
			this.shiftLeft();
		}

		if (direction === Direction.Right) {
			this.shiftRight();
		}

		this.handleDetonations(callback);
		this.addTile();
	}

	public updateWidthAndHeight(windowWidth: number, windowHeight: number): void {
		this.centerX = Math.round(
			windowWidth / 2 - (this.tileSize * this.rowLength) / 2
		);
		this.centerY = Math.round(
			windowHeight / 2 - (this.tileSize * this.columnLength) / 2
		);
	}

	public render(context: CanvasRenderingContext2D): void {
		context.save();

		context.translate(this.centerX, this.centerY);

		context.fillStyle = "#202c3d";
		context.fillRect(
			0,
			0,
			Math.round(this.tileSize * this.rowLength),
			Math.round(this.tileSize * this.columnLength)
		);

		for (let row = 0; row < this.rowLength; row++) {
			for (let column = 0; column < this.columnLength; column++) {
				this.tileBoard[row][column].render(context);
			}
		}

		context.restore();
	}
}

export default Board;

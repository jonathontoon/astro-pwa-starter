import { Sprite } from "@scripts/enums.ts";
import Spritesheet from "@imgs/spritesheet.png";

interface TileProps {
	x: number;
	y: number;
	size: number;
	sprite: Sprite;
}

class Tile {
	public x: number;
	public y: number;
	public sprite: Sprite;

	private width: number;
	private height: number;

	private spritesheet: HTMLImageElement;

	constructor({ x, y, size, sprite }: TileProps) {
		this.x = x;
		this.y = y;
		this.width = size;
		this.height = size;
		this.sprite = sprite;

		this.spritesheet = new Image();
		this.spritesheet.src = Spritesheet;
	}

	public isSprite(sprite: Sprite): boolean {
		return this.sprite === sprite;
	}

	public isEnemy(): boolean {
		return this.sprite === Sprite.Enemy;
	}

	public isHealth(): boolean {
		return this.sprite === Sprite.Health;
	}

	public isCoin(): boolean {
		return this.sprite === Sprite.Coin;
	}

	public isWall(): boolean {
		return this.sprite === Sprite.Wall;
	}

	public isEmpty(): boolean {
		return this.sprite === Sprite.Empty;
	}

	public isBomb(): boolean {
		return this.sprite === Sprite.Bomb;
	}

	public render(context: CanvasRenderingContext2D): void {
		context.beginPath();
		context.drawImage(
			this.spritesheet,
			this.sprite * 16,
			0,
			16,
			16,
			Math.round(this.x * this.width),
			Math.round(this.y * this.height),
			Math.round(this.width),
			Math.round(this.height)
		);
		context.closePath();
	}
}

export default Tile;

import Board from "@scripts/board.ts";
import Canvas from "@scripts/canvas.ts";
import { Direction } from "@scripts/enums.ts";

interface GameProps {
	id: string;
	score: number;
	health: number;
	magic: number;
	tileSize: number;
	gridSize: number;
}

class Game {
	private score: number;
	private health: number;
	private magic: number;

	private tileSize: number;
	private gridSize: number;

	private windowWidth: number;
	private windowHeight: number;

	private shakeStrength: number;
	private shakeDamper: number;
	private shakeAmount: number;

	private canvas: Canvas;
	private board: Board;

	constructor({ score, health, magic, tileSize, gridSize }: GameProps) {
		this.score = score;
		this.health = health;
		this.magic = magic;

		this.tileSize = tileSize;
		this.gridSize = gridSize;

		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;

		this.shakeStrength = 0;
		this.shakeDamper = 1;
		this.shakeAmount =
			Math.random() * 2 * this.shakeStrength - this.shakeStrength;

		this.canvas = new Canvas({
			id: "viewport",
			width: this.windowWidth,
			height: this.windowHeight
		});
		this.board = new Board({
			tileSize: this.tileSize,
			gridSize: this.gridSize,
			width: this.windowWidth,
			height: this.windowHeight
		});

		this.updateStrength = this.updateStrength.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.render = this.render.bind(this);

		window.addEventListener("resize", this.handleResize, false);
		window.addEventListener("keydown", this.handleKeyDown, false);
		window.requestAnimationFrame(this.render);
	}

	private updateStrength(): void {
		this.shakeStrength = 10;
	}

	private handleResize(): void {
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		this.canvas.updateWidthAndHeight(this.windowWidth, this.windowHeight);
		this.board.updateWidthAndHeight(this.windowWidth, this.windowHeight);
	}

	private handleKeyDown(event: KeyboardEvent): void {
		const key: string = event.code;
		switch (key) {
			case "ArrowLeft":
			case "KeyA": {
				this.board.shift(Direction.Left, this.updateStrength);
				break;
			}
			case "ArrowDown":
			case "KeyS": {
				this.board.shift(Direction.Down, this.updateStrength);
				break;
			}
			case "ArrowRight":
			case "KeyD": {
				this.board.shift(Direction.Right, this.updateStrength);
				break;
			}
			case "ArrowUp":
			case "KeyW": {
				this.board.shift(Direction.Up, this.updateStrength);
				break;
			}
			default: {
				break;
			}
		}
	}

	private render(): void {
		this.canvas.render((context: CanvasRenderingContext2D): void => {
			context.save();

			if (this.shakeStrength <= 0) {
				this.shakeStrength = 0;
			}

			this.shakeAmount =
				Math.random() * 2 * this.shakeStrength - this.shakeStrength;
			context.translate(this.shakeAmount, this.shakeAmount);

			this.board.render(context);

			context.restore();
			this.shakeStrength -= this.shakeDamper;
		});

		window.requestAnimationFrame(this.render);
	}

	public static initialize(gameArguments: GameProps): Game {
		return new Game(gameArguments);
	}
}

export default Game;

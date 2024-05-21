interface CanvasProps {
	id: string;
	width: number;
	height: number;
}

interface RenderCallback {
	(context: CanvasRenderingContext2D): void;
}

class Canvas {
	private element: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	private width: number;
	private height: number;

	constructor({ id, width, height }: CanvasProps) {
		this.element = document.getElementById(id) as HTMLCanvasElement;
		this.context = this.element.getContext("2d") as CanvasRenderingContext2D;

		this.width = width;
		this.height = height;

		this.element.setAttribute("width", `${(this, width)}`);
		this.element.setAttribute("height", `${this.height}`);
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;
	}

	public updateWidthAndHeight(width: number, height: number): void {
		this.width = width;
		this.height = height;

		this.element.setAttribute("width", `${(this, width)}`);
		this.element.setAttribute("height", `${this.height}`);
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;
	}

	public render(callback: RenderCallback): void {
		this.context.imageSmoothingEnabled = false;
		this.context.clearRect(0, 0, this.width, this.height);
		callback(this.context);
	}
}

export default Canvas;

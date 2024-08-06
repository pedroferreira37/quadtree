import { Point } from "./point";

export class Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;

	constructor(x: number, y: number, width: number, height: number, color: string = "#ffffff") {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	move(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	contains(point: Point) {
		return (
			point.x >= this.x &&
			point.x <= this.x + this.width &&
			point.y >= this.y &&
			point.y <= this.y + this.height
		);
	}

	intersects(range: Rectangle) {
		return !(
			range.x - range.width > this.x + this.width ||
			range.x + range.width < this.x - this.width ||
			range.y - range.height > this.y + this.height ||
			range.y + range.height < this.y - this.height
		);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.color;
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
}

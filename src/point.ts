export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	intersects(x: number, y: number) {
		const dx = (x - this.x) | 0;
		const dy = (y - this.y) | 0;
		const distance = Math.sqrt(dx * dx + dy * dy);

		return distance <= 5;
	}

	draw(ctx: CanvasRenderingContext2D, color: string = "#ffffff") {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	}
}

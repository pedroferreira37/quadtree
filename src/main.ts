import { Point } from "./point";
import { QuadTree } from "./quadtree";
import { Rectangle } from "./rectangle";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const button = document.querySelector("button") as HTMLButtonElement;
const ctx = canvas.getContext("2d")!;
const dpr = devicePixelRatio || 1;

const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

ctx.scale(dpr, dpr);

canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

const boundary = new Rectangle(0, 0, 602, 602);
const qtree = new QuadTree(boundary, 4);
const range = new Rectangle(rect.width / 2, rect.height / 2, 200, 200, "green");
const points: Point[] = [];
let found: Point[] = [];
let visualize = false;

((length: number, points: Point[], qtree: QuadTree) => {
	for (let i = 0; i < length; i++) {
		const point = new Point(Math.random() * rect.width, Math.random() * rect.height);
		points.push(point);
		qtree.insert(point);
	}
})(256, points, qtree);

function show(points: Point[], ctx: CanvasRenderingContext2D, color: string = "gray") {
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		point.draw(ctx, color);
	}
}

show(points, ctx);
show(found, ctx, "red");

canvas.addEventListener("mousemove", (event) => {
	const x = event.offsetX;
	const y = event.offsetY;

	requestAnimationFrame(() => {
		ctx.clearRect(0, 0, rect.width, rect.height);
		range.move(x, y);
		range.draw(ctx);

		found = [];
		qtree.query(range, found);

		show(points, ctx);
		show(found, ctx, "white");

		if (!visualize) return;

		qtree.visualize(ctx);
	});
});

button.addEventListener("click", () => {
	visualize = !visualize;
});

import { Point } from "./point";
import { QuadTree } from "./qtree";
import { Rectangle } from "./rectangle";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const dpr = devicePixelRatio || 1;

const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

ctx.scale(dpr, dpr);

canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
const qtree = new QuadTree(boundary, 4);

const points: Point[] = [];
let found: Point[] = [];
let visualize = false;
let origin = { x: 0, y: 0 };
let selecting = false;

var flush = function () {
	ctx.clearRect(0, 0, rect.width, rect.height);
};

var init = function (length: number, points: Point[], qtree: QuadTree) {
	for (let i = 0; i < length; i++) {
		const point = new Point(
			(Math.random() * rect.width) | 0,
			(Math.random() * rect.height) | 0
		);
		points.push(point);
		qtree.insert(point);
	}
};

var refresh = function () {
	ctx.clearRect(0, 0, rect.width, rect.height);
	show(points, ctx);
	show(found, ctx, "white");
};

var show = function (
	points: Point[],
	ctx: CanvasRenderingContext2D,
	color: string = "gray"
) {
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		point.draw(ctx, color);
	}
};

init(256, points, qtree);
show(points, ctx);
show(found, ctx, "red");
qtree.visualize(ctx);

canvas.addEventListener("mousedown", (event) => {
	const x = event.offsetX;
	const y = event.offsetY;
	selecting = true;

	origin = { x, y };
});

canvas.addEventListener("mousemove", (event) => {
	const x = event.offsetX;
	const y = event.offsetY;

	found = [];

	qtree.queryByPoint(x, y, found);

	const [target] = found;

	if (target) {
		target.draw(ctx, "red");
	} else {
		flush();
		show(points, ctx);
		qtree.visualize(ctx);
	}

	console.log(target);

	if (!selecting) return;

	requestAnimationFrame(() => {
		ctx.clearRect(0, 0, rect.width, rect.height);
		const range = new Rectangle(
			origin.x,
			origin.y,
			x - origin.x,
			y - origin.y,
			"green"
		);

		qtree.visualize(ctx);

		//range.move(x, y);

		range.draw(ctx);

		qtree.query(range, found);

		show(points, ctx);
		show(found, ctx, "red");

		found = [];

		if (!visualize) return;

		qtree.visualize(ctx);
	});
});

canvas.addEventListener("mouseup", () => {
	selecting = false;
	refresh();
	qtree.visualize(ctx);
});

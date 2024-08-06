import { Point } from "./point";
import { Rectangle } from "./rectangle";

export class QuadTree {
	private readonly boundary: Rectangle;
	private readonly capacity: number;
	private points: Point[] = [];
	private divided: boolean = false;

	private northeast?: QuadTree;
	private southeast?: QuadTree;
	private northwest?: QuadTree;
	private southwest?: QuadTree;

	constructor(boundary: Rectangle, capacity: number) {
		this.boundary = boundary;
		this.capacity = capacity;
	}

	insert(point: Point): boolean {
		if (!this.boundary.contains(point)) {
			return false;
		}

		if (this.points.length < this.capacity) {
			this.points.push(point);
		} else {
			if (!this.divided) this.subdivide();

			if (this.northeast!.insert(point)) return true;
			if (this.northwest!.insert(point)) return true;
			if (this.southeast!.insert(point)) return true;
			if (this.southwest!.insert(point)) return true;
		}

		return false;
	}

	subdivide() {
		const x = this.boundary.x;
		const y = this.boundary.y;
		const width = this.boundary.width;
		const height = this.boundary.height;

		const mw = width / 2;
		const mh = height / 2;

		const northeast = new Rectangle(x + mw, y, mw, mh);
		const northwest = new Rectangle(x, y, mw, mh);
		const southeast = new Rectangle(x + mw, y + mh, mw, mh);
		const southwest = new Rectangle(x, y + mh, mw, mh);

		this.northeast = new QuadTree(northeast, this.capacity);
		this.northwest = new QuadTree(northwest, this.capacity);
		this.southeast = new QuadTree(southeast, this.capacity);
		this.southwest = new QuadTree(southwest, this.capacity);

		this.divided = true;
	}

	query(range: Rectangle, found: Point[]) {
		if (!this.boundary.intersects(range)) return found;

		for (const point of this.points) {
			if (range.contains(point)) {
				found.push(point);
			}
		}

		if (this.divided) {
			this.northwest!.query(range, found);
			this.northeast!.query(range, found);
			this.southwest!.query(range, found);
			this.southeast!.query(range, found);
		}

		return found;
	}

	visualize(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.boundary.color;
		ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.width, this.boundary.height);
		if (this.divided) {
			this.northwest?.visualize(ctx);
			this.southeast?.visualize(ctx);
			this.northeast?.visualize(ctx);
			this.southwest?.visualize(ctx);
		}
	}
}

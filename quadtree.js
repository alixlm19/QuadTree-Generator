class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//Axis-aligned bounding box
class AABB {
    constructor(center, hd) {
        this.center = center; //AABB midpoint
        this.half_dimension = hd; //AABB length to edge from midpoint
    }

    //Checks if the current bounding box cointains a point p
    containsPoint(p) {
        return (p.x >= this.center.x - this.half_dimension && //Left boundary
            	p.x <= this.center.x + this.half_dimension && //Right boundary
            	p.y >= this.center.y - this.half_dimension && //Top boundary
            	p.y <= this.center.y + this.half_dimension);  //Bottom boundary
    }

    //Compares the current bounding box's boundarys intersects another AABB
    intersectsAABB(other) {
        let x1Min = this.center.x - this.half_dimension;
        let x1Max = this.center.x + this.half_dimension;
        let y1Min = this.center.y - this.half_dimension;
        let y1Max = this.center.y + this.half_dimension;
        
        let x2Min = other.center.x - other.half_dimension;
        let x2Max = other.center.x + other.half_dimension;
        let y2Min = other.center.y - other.half_dimension;
        let y2Max = other.center.y + other.half_dimension;
        
        return (x1Min <= x2Max || x1Max >= x2Min) &&
			   (y1Min <= y2Max || y2Max >= y2Min);
    }

    //Displays the current AABB
    show() {
        noFill();
        stroke(255);
        rect(this.center.x - this.half_dimension,
             this.center.y - this.half_dimension,
             this.half_dimension * 2,
             this.half_dimension * 2);
    }
}

const QT_NODE_CAPACITY = 4;

class QuadTree {
    constructor(center, half_dimension) {
        this.boundary = new AABB(center, half_dimension);
        this.points = [];

        this.northWest = null;
        this.northEast = null;
        this.southWest = null;
        this.southEast = null;
    }

    // Insert a point into the QuadTree
    insert(p) {

        //Ignore points that are not in the current quad tree range
        if (!this.boundary.containsPoint(p)) {
            return false;
        }

        //If there is space in the current QT and it doesn't have any
        //subdivisions, add the point there
        if (this.points.length < QT_NODE_CAPACITY &&
            this.northWest === null) {
            this.points.push(p);
            return true;
        }

        //Otherwise, subdivide and then add the point to
        //whichever node will accept it
        if (this.northWest === null) {
            this.subdivide();
        }

        //Add the point contained in this QT array

        if (this.northWest.insert(p)) return true;
        if (this.northEast.insert(p)) return true;
        if (this.southWest.insert(p)) return true;
        if (this.southEast.insert(p)) return true;

        //Return false if the point cannot be inserted into the QT
        //(THIS SHOULD NEVER HAPPEN)
        return false;
    }

    subdivide() {
        let new_centers = []; //[NW, NE, SW, SE]
        let new_half_dimension = this.boundary.half_dimension / 2;

        for (let i = 1; i >= -1; i -= 2) {
            for (let j = -1; j <= 1; j += 2) {
                let xOff = i * new_half_dimension; //x-offset of the new center
                let yOff = j * new_half_dimension; //y-offset of the new center

                new_centers.push(new Point(this.boundary.center.x + xOff,
                    this.boundary.center.y + yOff));
            }
        }

        //NorthWest QT                         				
        this.northWest = new QuadTree(new_centers[0],
            new_half_dimension);
        
        //NorthEast QT
        this.northEast = new QuadTree(new_centers[1],
            new_half_dimension);
        
        //SouthWest QT
        this.southWest = new QuadTree(new_centers[2],
            new_half_dimension);
        
        //SouthEast QT
        this.southEast = new QuadTree(new_centers[3],
            new_half_dimension);
    }

    //Finds the points contained within a range of the current QT
    queryRange(range) {
        let pointsInRange = [];
        
        if (!this.boundary.intersectsAABB(range)) {
            return pointsInRange;
        }
        
        for (let p of this.points) {
            if (range.containsPoint(p)) {
                pointsInRange.push(p);
            }
        }

        if (this.northWest === null) {
            return pointsInRange;
        }

        //Otherwise, add the points from the children
        pointsInRange = pointsInRange.concat(this.northWest.queryRange(range));
        pointsInRange = pointsInRange.concat(this.northEast.queryRange(range));
        pointsInRange = pointsInRange.concat(this.southWest.queryRange(range));
        pointsInRange = pointsInRange.concat(this.southEast.queryRange(range));
		
        return pointsInRange;
    }

    show() {
        this.boundary.show();
        if (this.northWest) this.northWest.show();
        if (this.northEast) this.northEast.show();
        if (this.southWest) this.southWest.show();
        if (this.southEast) this.southEast.show();
    }
}
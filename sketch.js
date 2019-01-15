let qt;
let bb;
let points = [];
let bbPoints = [];

function setup() {
    createCanvas(600, 400);
    qt = new QuadTree(new Point(width/2, height/2), width/2, height/2);
    bb = new AABB(new Point(0, 0), 40, 40);
}

function draw() {
    background(0);
    qt.show();
    
    //ellipseMode(CENTER);
    for(let p of points) {
        fill(255, 0, 0, 220);
        ellipse(p.x, p.y, 10, 10);
    }
    
    updateBoundingBox();
}

function updateBoundingBox() {
    bb.center.x = mouseX;
    bb.center.y = mouseY;
    bb.show();
    
    
    bbPoints = qt.queryRange(bb); 
    for(let p of bbPoints) {
        fill(255);
        ellipse(p.x, p.y, 10, 10);
    }
    
}

function mousePressed() {
    let p = new Point(mouseX, mouseY);
    qt.insert(p);
    points.push(p);
}

function keyPressed() {
 	if(key == ' ')  console.log(bbPoints);
    
} 
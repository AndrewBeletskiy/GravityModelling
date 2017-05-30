function Planet(x,y,r,m,c) {
    if (arguments.length !== 5) {
        throw "Planet(x,y,radius, mass, color)";
    }
    this.pos = new Point(x,y);
    this.radius = r;
    this.m = m;
    this.color = c;
    this.v = Point.NULL;
    this.a = Point.NULL;
}
Planet.prototype = {
    update: function(dt) {
        this.v = this.v.add(this.a.multiply(dt));
        this.pos = this.pos.add(this.v.multiply(dt))
    }
    
}


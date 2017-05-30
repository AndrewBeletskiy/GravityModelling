function Point(x,y) {
    this.x = x;
    this.y = y;
    this.length = Math.sqrt(x * x + y * y)

}


Point.prototype = {
    toString: function() {
        return "("+this.x+","+this.y+")";
    },
    add: function(another) {
        return new Point(this.x + another.x, this.y + another.y);
    },
    multiply: function(another) {
        if (another instanceof Point)
            return this.x * another.x + this.y * another.y;
        return new Point(this.x * another, this.y * another);
    },
    substract: function(another) {
        return new Point(this.x - another.x, this.y - another.y);
    },
    distantion: function(another) {
        return this.substract(another).length;
    },
    short: function() {
        return new Point(this.x / this.length, this.y / this.length);
    },
    cos: function(another) {
        return this.multiply(another)/this.length/another.length;
    },
    sin: function(another) {
        var cos = this.cos(another);
        var sin = Math.sqrt(1 - cos * cos);
        return sin * Math.sign(this.x * another.y - this.y * another.x);
    },
    proect: function(another) {
        return another.short().multiply(this.length * this.cos(another));
    },
    perpendicular: function(another) {
        return new Point(-this.y, this.x);
    }

}
Point.NULL = new Point(0,0);
Point.I = new Point(1,0);
Point.J = new Point(0,1);

Draw = {
    ctx: null,
    getSize: function() {
        var c = this.ctx.canvas;
        var w = c.width;
        var h = c.height;
        return new Point(w,h);
    },
    scale: new Point(1,1),
    setScale: function(dx,dy) {
        this.scale = new Point(dx,dy);
    },
    center: new Point(0,0),
    setCenter: function(x,y) {
        this.center = new Point(x,y);
    },
    traslateCoordinates: function(x,y) {
        if (arguments.length == 1 && x instanceof Point) {
            y = x.y;
            x = x.x;
        } else if (arguemnts.length > 2) {
            throw "traslateCoordinates(10,20) traslateCoordinates(new Point(10,20))";
        }
        return new Point(x * this.scale.x + this.center.x,
                         y * this.scale.y + this.center.y);

    },
    translateToColor: function(r,g,b, a) {
        var max = Math.max(r,g,b);
        a = a || 1;
        if (max > 255)
        {
            r /= max * 255;
            g /= max * 255;
            b /= max * 255;
        }
        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);

        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    },
    setColor: function(color) {
        if (arguments.length === 3 || arguments.length === 4) {        
            this.setColor(this.translateToColor(arguments[0], arguments[1], arguments[2], arguments[3]));
        } else if (arguments.length === 1) {
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = color;
        } else {
            throw "setColor(\"FFF\") setColor(127,128,129) setColor(127,128,129,0.1)";
        }
    },
    clear: function() {
        var size = this.getSize();
        this.ctx.clearRect(0,0,size.x,size.y);
    },
    isInTheScreen: function(p) {
        var z = this.traslateCoordinates(p);
        var size = this.getSize();
        return (z.x >= 0 && z.x <= size.x) 
            && (z.y >= 0 && z.y <= size.y);
    },
    line: function(p1x, p1y, p2x, p2y) {
        if (arguments.length == 2 
                && arguments[0] instanceof Point
                && arguments[1] instanceof Point) {
            if (this.isInTheScreen(arguments[0]) 
                || this.isInTheScreen(arguments[1]))
            {
                var a = this.traslateCoordinates(arguments[0]);
                var b = this.traslateCoordinates(arguments[1]);
                this.ctx.beginPath();
                this.ctx.moveTo(a.x, a.y);
                this.ctx.lineTo(b.x, b.y);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        } else if (arguments.length === 4) {
            this.line(new Point(arguments[0],arguments[1]), 
                      new Point(arguments[2], arguments[3]));
        }
    },
    circle: function(center, radius) {
        if (arguments.length == 2
                && arguments[0] instanceof Point) {
            var inScreen = false;
            inScreen = inScreen || this.isInTheScreen(center);
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(radius,0)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(-radius,0)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(0,radius)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(0,-radius)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(radius,radius)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(radius,-radius)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(-radius,radius)));
            inScreen = inScreen || this.isInTheScreen(center.add(new Point(-radius,-radius)));
            if (inScreen) {
                var c = this.traslateCoordinates(center);
                var r = radius * (this.scale.x + this.scale.y) / 2;
                this.ctx.beginPath();
                this.ctx.arc(c.x,c.y,r,0,2*Math.PI, true);
                this.ctx.closePath();
                this.ctx.fill();

            }
        } else if (arguments.length == 3) {
            this.circle(new Point(arguments[0], arguments[1]), arguments[3]);
        } else {
            throw "Need three arguments in circle (x,y,radius) circle(center, radius) \\\\Center must be instance of Point";
        }
    }
}

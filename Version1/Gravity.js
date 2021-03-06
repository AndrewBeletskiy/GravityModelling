function Gravity() {
    this.planets = [];
}
Gravity.prototype  = {
    checkCollision: function() {
        for (var i = 0, n = this.planets.length; i < n; i++) {
            p1 = this.planets[i];
            for (var j = i+1; j < n; j++) {
                p2 = this.planets[j];
                var dr = p2.pos.substract(p1.pos);
                var len = dr.length;
                if (len < p1.radius + p2.radius) {
                    // Set Position
                    // Set maximum m
                    (function() {
                        var P = (p1.m > p2.m) ? p1 : p2;
                        var p = (p1.m > p2.m) ? p2 : p1;
                        var dr = p.pos.substract(P.pos);
                        p.pos = P.pos.add(dr.short().multiply(P.radius + p.radius));
                    })()
                    

                    // Calculate Velocities
                    var v1 = p1.v;
                    var v2 = p2.v;
                    var m1 = p1.m;
                    var m2 = p2.m;
                    var i = dr.short();
                    var j = dr.perpendicular();

                    var v1y = v1.proect(j);
                    var v2y = v2.proect(j);
                    var v1x = v1.proect(i);
                    var v2x = v2.proect(i);
                    var nextV1 = v1x.substract(v2x.multiply(-m2 / m1));
                    var nextV2 = v2x.substract(v1x.multiply(-m1 / m2));
                    p1.v = v1y.add(nextV1);
                    p2.v = v2y.add(nextV2);
                                        
                    console.log("collide");
                }
            }
        }    
    },
    update: function() {
        //this.checkCollision();
        for (var i = 0, n = this.planets.length; i < n; i++) {
            var planet = this.planets[i];
            planet.a = new Point(0,0);
            for (var j = 0; j < n; j++) {
                if (i!==j) {
                    var a = this.getAcceleration(planet, this.planets[j]);
                    planet.a = planet.a.add(a);
                }
            }        
        }
        for (var i = 0, n = this.planets.length; i < n; i++) {
            this.planets[i].update(1);
        }
    },
    draw: function() {
        for (var i = 0, n = this.planets.length; i < n; i++) {
            var p = this.planets[i];
            Draw.setColor(p.color)
            Draw.circle(p.pos, p.radius);
            if (Constants.drawVelocity)
                Draw.line(p.pos, p.pos.add(p.v.multiply(Constants.dVelocity)))
            if (Constants.drawAcceleration)
                Draw.line(p.pos, p.pos.add(p.a.multiply(Constants.dAcceleration)))
        }

    },
    getAcceleration: function(pl1, pl2) {
        var full = Constants.GravityConstant * pl2.m / Math.pow(pl1.pos.distantion(pl2.pos),2);
        var dr = pl2.pos.substract(pl1.pos);
        if (dr.length < pl1.radius + pl2.radius)
            dr = dr.short().multiply(pl1.radius + pl2.radius);
        var full = Constants.GravityConstant * pl2.m / Math.pow(dr.length,2);
        var res = dr.short()
                 .multiply(full);
        res = res.add(Constants.g);

        return res;
    },
    addPosition: function(delta) {
        for (var i = 0, n = this.planets.length; i < n; i++) {
            this.planets[i].pos = this.planets[i].pos.add(delta);
        }
    }
};

(function(canvasId) {
    function addPlanet(x,y,r,m,c,v,a) {
        var newPlanet = new Planet(x,y,r,m,c);
        if (v)
            newPlanet.v = v;
        if (a)
            newPlanet.a = a;
        gravity.planets.push(newPlanet);
    }
    function calculateR(m) {
        var m0 = 100;
        var r0 = 10;
        if (m == m0) {
            return r0;
        }
        else {
            return r0 * Math.sqrt(m / m0);
        }
    }
    var canvas = document.getElementById(canvasId)
    var WIDTH = canvas.width = 800;
    var HEIGHT = canvas.height = 600;
    var ctx = canvas.getContext('2d');
    Draw.ctx = ctx;
    Draw.setCenter(WIDTH / 2, HEIGHT / 2);
    Draw.setScale(0.1,0.1);
    var gravity = new Gravity();
    z = gravity
    ///*

    var v = new Point(Math.sqrt(10000/ 2000),0);
    addPlanet(0, 2000, calculateR(10000), 10000, "#fff");
    addPlanet(0,0,calculateR(1000),1000, "#ff0", v);
    
    addPlanet(0,200,calculateR(10),10, "#ff0", new Point(Math.sqrt(5),0).add(v));    
    addPlanet(0,-100,calculateR(10),10, "#0ff", new Point(Math.sqrt(11),0).add(v));    
    addPlanet(0,240,calculateR(20),20, "#f00", new Point(Math.sqrt(1000/250),0).add(v));    
    //addPlanet(0,-100,calculateR(10),10, "#fff", new Point(1,0));    
    /*
    //for (var i = 0; i < 250; i++) {
        var m = Math.random()*1000;
        var x = Math.random()*10000-5000;
        var y = Math.random()*10000 - 5000;
        var d = Math.sqrt(x*x + y*y);
        var v = new Point(0,0); //new Point(-y, x);
        //v = v.short().multiply(Math.sqrt(1000 / d));

        addPlanet(x,y,calculateR(m), m, "#fff", v);

    }
    //*/
    function draw() {
        if (Constants.isSetCenterOnFirst)
            Draw.setCenter(WIDTH / 2 - gravity.planets[0].pos.x * Draw.scale.x, HEIGHT / 2 - gravity.planets[0].pos.y * Draw.scale.y);
        if (Constants.isClear)
            Draw.clear();
        gravity.draw();
    }
    function update() {
        gravity.update();
    }
    function loop() {
        update();
        draw();
        requestAnimationFrame(loop)
    }
    loop();
    window.addEventListener("keypress", function(e) {
        Constants.isClear = !Constants.isClear;
    });
    console.log("ok");

})("canvas");

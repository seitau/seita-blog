import 'babel-polyfill';

class Particle {
    constructor(x, y, xspeed, yspeed, c, p5) {
        this.px = x;
        this.py = y;
        this.pxspeed = xspeed;
        this.pyspeed = yspeed;
        this.pc = c;
        this.p5 = p5;
    }

    move() {
        let particleSize = this.p5.random(20, 40);
        this.px = this.px + this.pxspeed;
        this.py = this.py + this.pyspeed;
        this.p5.strokeWeight(this.p5.random(0.5, 2));
        this.p5.fill(this.pc, this.p5.random(30, 40));
        this.p5.ellipse(this.px, this.py, particleSize, particleSize);

        const profile = document.getElementById("profile-inner");
        if(this.px > profile.clientWidth || this.px < 0) {
            this.pxspeed = -this.pxspeed; 
        } 
        if(this.py > profile.clientHeight || this.py < 0) { 
            this.pyspeed = -this.pyspeed; 
        } 
    }
}

let canvasWidth;
let canvasHeight;
let canvas;
let particles = [];
const sketch = function(p5) {
    p5.setup = async function() {
        const profile = document.getElementById("profile-inner");
        canvas = p5.createCanvas(profile.clientWidth, profile.clientHeight);
        canvas.parent('profile-inner');
        canvas.position(0, 0);
        canvas.style('z-index', '-3');

        canvasWidth = profile.clientWidth;
        canvasHeight = profile.clientHeight;

        for(let i = 0; i < 3; i++) {
            particles.push(new Particle(p5.random(0, profile.clientWidth), p5.random(0, profile.clientHeight), p5.random(-2, 2), p5.random(-2, 2), p5.color(p5.random(255), p5.random(255), p5.random(255)), p5));
        }
    }

    p5.draw = async function() {
        p5.background('#fff');
        for(let i = 0; i < particles.length; i++) {
            particles[i].move();
        }
    }

    p5.windowResized = function() {
        const profile = document.getElementById("profile-inner");
        p5.resizeCanvas(profile.clientWidth, profile.clientHeight);
    }

    p5.mousePressed = function() {
    }

    p5.mouseWheel = function(event) {
    }
}

new p5(sketch)

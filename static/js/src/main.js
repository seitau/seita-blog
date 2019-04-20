import 'babel-polyfill';

let canvas;
const sketch = function(p5) {
    p5.setup = async function() {
        const profile = document.getElementById("profile-inner");
        canvas = p5.createCanvas(profile.clientWidth, profile.clientHeight);
        canvas.parent('profile-inner');
        canvas.position(0, 0);
        canvas.style('z-index', '-3');
    }

    p5.draw = async function() {
        p5.background('#fff');
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


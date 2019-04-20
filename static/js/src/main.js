import 'babel-polyfill';

const sketch = function(p5) {
    p5.setup = async function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(0);
        console.log('hoge');
    }

    p5.draw = async function() {
        p5.background(0);
    }

    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    p5.mousePressed = function() {
    }

    p5.mouseWheel = function(event) {
    }
}

new p5(sketch)


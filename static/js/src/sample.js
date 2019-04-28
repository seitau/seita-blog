const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const s = function(p5) {
    p5.setup = function() {
        sample = document.getElementById("sample");
        sample.style.height = `${sample.clientWidth}px`;
        const canvas = p5.createCanvas(sample.clientWidth, sample.clientHeight);
        canvas.parent('sample');
        canvas.position(0, 0);
        canvas.style('z-index', '0');
        p5.background(0);
    }

    p5.draw = async function() {
        p5.fill(255);
        const x = p5.mouseX;
        const y = p5.mouseY;
        await sleep(1000);
        p5.ellipse(x, y, 20, 20);
    }
}

export let sample = s;

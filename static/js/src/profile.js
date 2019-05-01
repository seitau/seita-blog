class Particle {
    constructor(x, y, xspeed, yspeed, c, p5) {
        this.px = x;
        this.py = y;
        this.pxspeed = xspeed;
        this.pyspeed = yspeed;
        this.pc = c;
        this.p5 = p5;
        this.bounced = false;
    }

    move() {
        let particleSize = this.p5.random(20, 40);
        this.px += this.pxspeed;
        this.py += this.pyspeed;
        this.p5.stroke('black');
        this.p5.strokeWeight(this.p5.random(0.5, 2));
        this.p5.fill(this.pc, this.p5.random(30, 40));
        this.p5.ellipse(this.px, this.py, particleSize, particleSize);

        const profile = document.getElementById("profile-inner");
        if(this.px > profile.clientWidth || this.px < 0) {
            this.invertXSpeed();
        } 
        if(this.py > profile.clientHeight || this.py < 0) { 
            this.invertYSpeed();
        } 
    }

    position() {
        return {
            x: this.px,
            y: this.py,
        }
    }

    invertXSpeed() {
        this.pxspeed = -this.pxspeed; 

    }

    invertYSpeed() {
        this.pyspeed = -this.pyspeed; 
    }
}

let canvasWidth;
let canvasHeight;
let canvas;
let particles = [];
const s = function(p5) {
    p5.setup = async function() {
        const profile = document.getElementById("profile-inner");
        canvas = p5.createCanvas(profile.clientWidth, profile.clientHeight);
        canvas.parent('profile-inner');
        canvas.position(0, 0);
        canvas.style('z-index', '-3');

        canvasWidth = profile.clientWidth;
        canvasHeight = profile.clientHeight;

        for(let i = 0; i < 3; i++) {
            particles.push(new Particle(
                p5.random(0, profile.clientWidth),
                p5.random(profile.clientHeight/2, profile.clientHeight),
                p5.random(-2, 2),
                p5.random(-2, 2),
                p5.color(p5.random(255), p5.random(255), p5.random(255)),
                p5)
            );
        }

        p5.background('#ffffff');
    }

    p5.draw = async function() {
        p5.background('#ffffff');

        const profileImg = p5.select('#avatar-placeholder');
        const profileImgSize = profileImg.size();
        const profileImgX = 78+profileImgSize.width/2;
        const profileImgY = 25+profileImgSize.height/2;

        for(let i = 0; i < particles.length; i++) {
            particles[i].move();

            const p = particles[i].position();
            if(p5.dist(profileImgX, profileImgY, p.x, p.y) <= profileImgSize.width/2) {
                particles[i].bounced = true;
                particles[i].invertXSpeed();
                particles[i].invertYSpeed();
                particles[i].move();
                p5.fill('#fff');
                p5.ellipse(profileImgX, profileImgY, profileImgSize.width+100, profileImgSize.height+100);
            }

            if(particles[i].bounced && particles.length < 7) {
                const particlePosition = particles[i].position();
                const newParticle = new Particle(
                    particlePosition.x,
                    particlePosition.y,
                    particles[i].pxspeed+1,
                    particles[i].pyspeed+1,
                    p5.color(p5.random(255), p5.random(255), p5.random(255)),
                    p5,
                )
                particles.push(newParticle);
            }
            particles[i].bounced = false;
        }

        //p5.noFill();
        //p5.noStroke();
        //p5.ellipse(, , profileImgSize.width, profileImgSize.height);
        //p5.fill(255, 60);
        //p5.noStroke();
        //p5.rect(0, 0, canvasWidth, canvasHeight);
        //p5.background('rgba(255, 255, 255, 0.3)');
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

export let profile = s;

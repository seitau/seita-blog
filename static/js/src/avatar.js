const s = function(p5) {
    let avatar,
        imgDali,
        imgDaliWidth,
        imgDaliHeight,
        imgPortraitMono,
        imgPortraitColor,
        weight;
    let colors = new Array();
    const imgPath = "/img/";
     
    p5.setup = function() {
        avatar = document.getElementById("avatar-placeholder");
        const canvas = p5.createCanvas(avatar.clientWidth, avatar.clientHeight);
        canvas.parent('avatar-placeholder');
        canvas.position(0, 0);
        canvas.style('z-index', '0');
        p5.background(0);

        imgDali = p5.loadImage(imgPath + "persistence_of_memory.jpg");
        imgDaliWidth = 500;
        imgDaliHeight = 500;
        imgPortraitMono = p5.loadImage(imgPath + "me.png");
        imgPortraitMono.filter(p5.GRAY);
        imgPortraitColor = p5.loadImage(imgPath + "me.png");
        p5.frameRate(1);
    }

    p5.draw = async function() {
        extractColors();
        imgPortraitMono.resize(avatar.clientWidth, avatar.clientHeight);
        imgPortraitColor.resize(avatar.clientWidth, avatar.clientHeight);
        p5.image(imgPortraitColor, 0, 0);
        for(let y = 0; y < imgPortraitColor.height; y += 3){
            for(let x = 0; x < imgPortraitColor.width; x += 2){
                const color = imgPortraitMono.get(x, y);
                weight = adjustWeight(color);
                console.log(color);
                if(weight == 0) {
                    continue;
                }
                p5.stroke(colors[weight-1]);
                p5.strokeWeight(weight);
                p5.line(x, y, x+1, y);
            }
        }
    }

    function adjustWeight(color){
        for(let i = 10; i > 0; i--) {
            if(color < -16 * 100000 * i) {
                return i;
            }
        }
        return 0;
    }

    function extractColors() {
        for(let i = 0; i < colors.length; i++) {
            const x = int(p5.random(imgDaliWidth));
            const y = int(p5.random(imgDaliHeight));
            const tempColor = imgDali.get(x, y);
            colors.push(tempColor);
        }
    }

}

export let avatar = s;

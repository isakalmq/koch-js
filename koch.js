const canvas = document.getElementById("drawing-canvas");
const context = canvas.getContext('2d');

var dotArray = [[0.1, 0.1], [0.5, 0.9], [0.9, 0.1]];

const seed = [[0, 0], [1/3, 0], [0.5, Math.sqrt(3)/6], [2/3, 0], [1, 0]];

var start = [[0,0], [1,0]];
var start = [[0, 0], [1, 0], [0.5, Math.sqrt(3)/6], [0,0]]
var start = [[0,0], [0.5, Math.sin(Math.PI/3)], [1,0], [0,0]];
var moving = false;
var prevMouseX;
var prevMouseY;
var offset = [10,10];

var scale = 1;

var iteration = 0;
var curr = start;

function transformToAbs(dots, width, height) {
    let returnArray = [];
    dots.forEach(element => returnArray.push([element[0]*width*scale+offset[0], element[1]*height*scale+offset[1]]))
    return returnArray;
}

function line(dots) {
    context.beginPath();
    context.moveTo(dots[0][0], dots[0][1]);
    dots.forEach(element => context.lineTo(element[0], element[1]));
    context.stroke();
}

function createRotationMatrix(p) {    
    let angle = Math.atan(p[1]/p[0]);
    if (p[0] >= 0) {
        return [[Math.cos(angle), -Math.sin(angle)], 
                [Math.sin(angle),  Math.cos(angle)]];
    } else {
        angle = angle + Math.PI;
        return [[Math.cos(angle), -Math.sin(angle)], 
                [Math.sin(angle),  Math.cos(angle)]];
    }
    
    // Alternative (faster?) solution. 
    // Needs adjusting of angles in the case of p[0] < 0       
    /*
    let fac = p[1]/p[0];
    let s = 1/Math.sqrt(1+Math.pow(fac,2));

    return [[s, -s*fac],
            [s*fac,  s]];
    */
}

function replaceLineSeed(p1, p2, seed) {
    let rotationMatrix = createRotationMatrix(sub(p2, p1));
    let l = length(sub(p2, p1));
    let scalingMatrix = [[l, 0],
                         [0, l]];
    let totalMatrix = mproduct(rotationMatrix, scalingMatrix);
    let returnArray = [];
    seed.forEach(element => returnArray.push(add(vproduct(totalMatrix, element), p1)));
    return returnArray;
}

function iterate(curr, seed) {
    let returnArray = [];
    let prev = curr[0];

    for(let i = 1; i < curr.length; ++i) {
        let res = replaceLineSeed(prev, curr[i], seed);
        res.forEach(element => returnArray.push(element));
        prev = curr[i]
    }
    return returnArray;
}

function draw()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-300;
    context.clearRect(0,0, canvas.width, canvas.height);

    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var relPosH = 0.5;
    var relPosW = 0.5;
    var minHW = Math.min(width, height);
    line(transformToAbs(curr, minHW, minHW));
}

window.addEventListener('resize', draw);

document.getElementById("iterate-button").addEventListener("click", function() {
    e.preventDefault();
    curr = iterate(curr, seed);
    iteration++;
    updateIterationIndicator();
    draw();
})

document.getElementById("reset-button").addEventListener("click", function() {
    e.preventDefault();
    curr = start;
    scale = 1;
    offset = [10,10];
    iteration = 0;
    updateZoomIndicator();
    updateIterationIndicator();
    draw();
})

function updateZoomIndicator() {
    document.getElementById("zoom-indicator").innerHTML = Math.round(scale*100) + " %"
}

function updateIterationIndicator() {
    document.getElementById("iteration-indicator").innerHTML = "Iteration: " + iteration;
}

document.getElementById("zoom-in-button").addEventListener("click", function() {
    e.preventDefault();
    scale += 0.1
    updateZoomIndicator();
    draw();
})

document.getElementById("zoom-out-button").addEventListener("click", function() {
    e.preventDefault();
    scale -= 0.1
    updateZoomIndicator();
    draw();
})

canvas.addEventListener("pointerdown", e => {
    e.preventDefault();
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    moving = true;
})

canvas.addEventListener("pointerup", e => {
    e.preventDefault();
    moving = false;

})

canvas.addEventListener("pointermove", e => {
    e.preventDefault();
    if(moving) {
        offset = [offset[0] + e.offsetX-prevMouseX, offset[1] + e.offsetY-prevMouseY]
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        draw();
    }
})

canvas.addEventListener('wheel', e =>{
    console.log("Hej!");
    e.preventDefault()
    scale += e.deltaY * -0.01;
    updateZoomIndicator();
    draw();
})

draw();
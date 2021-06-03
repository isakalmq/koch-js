const canvas = document.getElementById("drawing-canvas");
const context = canvas.getContext('2d');

var seedMap = new Map();
seedMap.set('Koch', [[0, 0], [1/3, 0], [0.5, Math.sqrt(3)/6], [2/3, 0], [1, 0]]);
seedMap.set('Minkowski', [[0,0], [1/4, 0], [1/4, 1/4], [1/2, 1/4], [1/2, 0], [1/2, -1/4], [3/4, -1/4], [3/4, 0], [1, 0]]);
seedMap.set('?', [[0,0], [1/2, Math.sqrt(1/3)/2], [1/2, -Math.sqrt(1/3)/2], [1,0]])
seedMap.set('?2', [[0,0], [1/4, 1/4], [1/2, 0], [3/4, -1/4], [1,0]])
seedMap.set('Cesàro 50', cesaro(Math.PI-50*Math.PI/180));
seedMap.set('Cesàro 60', cesaro(Math.PI-Math.PI/3));
seedMap.set('Cesàro 70', cesaro(Math.PI-70*Math.PI/180));
seedMap.set('Cesàro 80', cesaro(Math.PI-80*Math.PI/180));
seedMap.set('Cesàro 85', cesaro(Math.PI-85*Math.PI/180));
seedMap.set('Cesàro 90', cesaro(Math.PI-90*Math.PI/180));




var shapeMap = new Map();
shapeMap.set('Line', [[0,0], [1,0]]);
shapeMap.set('Triangle', [[0,0], [0.5, Math.sin(Math.PI/3)], [1,0], [0,0]]);
shapeMap.set('Inner triangle', [[0,0], [1,0],[0.5, Math.sin(Math.PI/3)], [0,0]]);
shapeMap.set('Square', [[0,0], [0,1], [1,1], [1,0], [0,0]]);
shapeMap.set('Inner square', [[0,0], [1,0], [1,1], [0,1], [0,0]]);


var seed = seedMap.get('Koch');
var start = shapeMap.get('Line');

var iteration;
var curr;

reset();
draw();

function cesaro(angle) {
    let h = Math.tan((Math.PI - angle)/2)/2
    let l = h/Math.sin(Math.PI - angle);

    return [[0,0], [l, 0], [0.5, h], [1-l, 0], [1,0]];
}

function reset() {
    iteration = 0;
    curr = start;
}
function transformToAbs(dots, scale) {
    let returnArray = [];
    dots.forEach(element => returnArray.push([element[0]*scale, element[1]*scale]))
    return returnArray;
}

function line(dots) {
    context.beginPath();
    context.moveTo(dots[0][0], dots[0][1]);
    dots.forEach(element => context.lineTo(element[0], element[1]));
    context.stroke();
}

function replaceLineSeed(p1, p2, seed) {
    p = sub(p2, p1);
    let angle = Math.atan(p[1]/p[0])

    if (p[0] < 0) {
        angle = angle + Math.PI;
    }
    let rotationMatrix = createRotationMatrix(angle);

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
    returnArray.push(curr[0])
    let prev = curr[0];

    for(let i = 1; i < curr.length; ++i) {
        let res = replaceLineSeed(prev, curr[i], seed).slice(1);
        res.forEach(element => returnArray.push(element));
        prev = curr[i]
    }
    return returnArray;
}

function draw()
{
    ctrl = document.getElementById("control")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-ctrl.clientHeight-5;
    context.clearRect(0,0, canvas.width, canvas.height);

    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    line(transformToAbs(curr, 500));
}
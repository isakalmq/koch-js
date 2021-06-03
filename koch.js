const canvas = document.getElementById("drawing-canvas");
const context = canvas.getContext('2d');


var seedMap = new Map();
seedMap.set('Koch', [[0, 0], [1/3, 0], [0.5, Math.sqrt(3)/6], [2/3, 0], [1, 0]]);
seedMap.set('Minkowski', [[0,0], [1/4, 0], [1/4, 1/4], [1/2, 1/4], [1/2, 0], [1/2, -1/4], [3/4, -1/4], [3/4, 0], [1, 0]]);
seedMap.set('Terdragon', [[0,0], [1/2, Math.sqrt(1/3)/2], [1/2, -Math.sqrt(1/3)/2], [1,0]])
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

var currFractal = new kochLikeFractal(start, seed);

var scale = 1;
var originX = 0;
var originY = 0;
var visibleWidth = canvas.clientWidth;
var visibleHeight = canvas.clientHeight;

var iteration;
var curr;
var offset;
var curveScale;
reset();
draw();

function reset() {
    scale = 1;
    originX = 0;
    originY = 0;
    visibleWidth = canvas.clientWidth;
    visibleHeight = canvas.clientHeight;

    iteration = 0;
    //curr = start;

    ctrl = document.getElementById("control")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-ctrl.clientHeight-5;
    context.clearRect(0,0, canvas.width, canvas.height);

    curveScale = Math.min(canvas.width, canvas.height)*0.6;
    offset = [(canvas.width - curveScale)/2, (canvas.height - curveScale)/2]
}

function draw()
{
    context.fillStyle = "white";
    context.fillRect(originX, originY, canvas.width*1/scale, canvas.height*1/scale);

    currFractal.draw(canvas, curveScale, offset);
}

function zoom(zoom, point) {
    console.log("zooom: " + zoom);
    context.translate(originX, originY)

    originX -= point[0] / (scale * zoom) - point[0] / scale;
    originY -= point[1] / (scale * zoom) - point[1] / scale;

    context.scale(zoom, zoom)
    context.translate(-originX, -originY);

    scale *= zoom;

    visibleWidth = canvas.clientHeight / scale;
    visibleHeight = canvas.clientWidth / scale;
    draw();
}
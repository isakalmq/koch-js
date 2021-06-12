/**
 * Base class for fractals
 */
class fractal {
    constructor() {

    };
    /**
     * Draws the fractal 
     * @param {canvas} canvas The HTML canvas the fractal will be drawn on
     * @param {number} curveScale The scale of the curve, number of pixels in width
     * @param {Array<number>} offset  The offset of the curve
     */
    draw(canvas, curveScale, offset) {
        throw new Error("Pwease impwement me UwU")
    }
}

/**
 * Line based fractal
 */
class lineBasedFractal extends fractal {
    constructor(start, seed) {
        super();
        this.startShape = start;
        this._curr = start;
        this.seed = seed;
        this._iteration = 0;
    }

    /**
     * Draws the fractal 
     * @param {canvas} canvas The HTML canvas the fractal will be drawn on
     * @param {number} curveScale The scale of the curve, number of pixels in width
     * @param {Array<number>} offset  The offset of the curve
     */
    draw(canvas, curveScale, offset) {
        let toDraw = transformToAbs(this.curr, curveScale, offset);
        let context = canvas.getContext('2d');

        context.beginPath();
        context.moveTo(toDraw[0][0], toDraw[0][1]);
        toDraw.forEach(element => context.lineTo(element[0], element[1]));
        context.stroke();
    }

    /**
     * Function used for iterating the fractal one more step
     */
    iterate() {
        throw new Error("Pwease impwement me UwU")
    }

    reset() {
        this.curr = this.startShape;
        this._iteration = 0;
    }

    get curr() {
        return this._curr;
    }

    set curr(newCurr) {
        this._curr = newCurr;
    }

    get iteration() {
        return this._iteration;
    }
}

/**
 * Class for representing koch-curve like fractals
 */
class kochLikeFractal extends lineBasedFractal {
    constructor(start, seed) {
        super(start, seed);
    }

    /**
     * Function used for iterating the fractal one more step
     */
    iterate() {
        let resultArray = [];
        resultArray.push(this.curr[0])
        let prev = this.curr[0];

        for (let i = 1; i < this.curr.length; ++i) {
            let res = replaceLineSeed(prev, this.curr[i], this.seed).slice(1);
            res.forEach(element => resultArray.push(element));
            prev = this.curr[i]
        }

        this.curr = resultArray;
    }
}

class cesaroFractal extends kochLikeFractal {
    constructor(start, angleRad) {
        super(start, cesaro(angleRad))
    }
}

class planeFillingFractal extends lineBasedFractal {
    constructor(start, seed) {
        super(start, seed);
    }

    /**
     * Function used for iterating the fractal one more step
     */
     iterate() {
        let resultArray = [];
        resultArray.push(this.curr[0])
        let prev = this.curr[0];

        for (let i = 1; i < this.curr.length; ++i) {
            let res = replaceLineSeed(prev, this.curr[i], this.seed).slice(1);
            res.forEach(element => resultArray.push(element));
            prev = this.curr[i]
        }

        this.curr = resultArray;
    }
}

/**
 * To be moved inside of objects
 */
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

function transformToAbs(dots, scale, offset) {
    let returnArray = [];
    dots.forEach(element => returnArray.push([element[0]*scale + offset[0], element[1]*scale + offset[1]]))
    return returnArray;
}

function cesaro(angle) {
    let h = Math.tan((Math.PI - angle)/2)/2
    let l = h/Math.sin(Math.PI - angle);

    return [[0,0], [l, 0], [0.5, h], [1-l, 0], [1,0]];
}
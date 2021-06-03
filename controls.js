seedSelector = document.getElementById("seed-selector");
shapeSelector = document.getElementById("shape-selector");

var moving = false;
var prevMouseX;
var prevMouseY;

function generateInnerHTML(map) {
    ih = '';
    for(const key of map.keys()) {
        ih += `<option value="${key}">${key}</option>\n`
    }

    return ih;
}

seedSelector.innerHTML = generateInnerHTML(seedMap);
shapeSelector.innerHTML = generateInnerHTML(shapeMap);

seedSelector.addEventListener('change', e => {
    e.preventDefault();
    //seed = seedMap.get(seedSelector.value);
    currFractal = new kochLikeFractal(shapeMap.get(shapeSelector.value), seedMap.get(seedSelector.value))
    draw();
})

shapeSelector.addEventListener('change', e => {
    e.preventDefault();
    currFractal = new kochLikeFractal(shapeMap.get(shapeSelector.value), seedMap.get(seedSelector.value))
    draw();
})

// Pinch zoom
// Global vars to cache event state
var evCache = new Array();
var prevDiff = -1;

function pointerdown_handler(ev) {
    ev.preventDefault();
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    evCache.push(ev);
}

function pointermove_handler(ev) {
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the target element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
   
    // Find this event in the cache and update its record with this event
    for (var i = 0; i < evCache.length; i++) {
      if (ev.pointerId == evCache[i].pointerId) {
         evCache[i] = ev;
      break;
      }
    }
   
    if (evCache.length == 1) {
        if(moving) {
            offset = [offset[0] + (ev.offsetX-prevMouseX)/scale, offset[1] + (ev.offsetY-prevMouseY)/scale]
            prevMouseX = ev.offsetX;
            prevMouseY = ev.offsetY;
            draw();
        }
    }

    // If two pointers are down, check for pinch gestures
    else if (evCache.length == 2) {
      // Calculate the distance between the two pointers
      var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
   
      if (prevDiff > 0) {
        //let amount = Math.exp(-0.01*(curDiff-prevDiff < 0 ? 1 : -2));
        let amount = Math.exp(0.005*(curDiff-prevDiff));

        let point = [(evCache[0].clientX + evCache[1].clientX)/2, (evCache[0].clientY + evCache[1].clientY)/2];

        if (curDiff > prevDiff) {
          // The distance between the two pointers has increased
          zoom(amount, point);
          draw();
          updateZoomIndicator();
        }
        if (curDiff < prevDiff) {
          // The distance between the two pointers has decreased
          zoom(amount, point);
          draw();
          updateZoomIndicator();
        }
      }
   
      // Cache the distance for the next move event
      prevDiff = curDiff;
    }
}

function pointerup_handler(ev) {
    ev.preventDefault();
    // Remove this pointer from the cache and reset the target's
    // background and border
    remove_event(ev);

    
  
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
    }
}

function init() {
    // Install event handlers for the pointer target
    var el=document.getElementById("drawing-canvas");
    el.onpointerdown = pointerdown_handler;
    el.onpointermove = pointermove_handler;
   
    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el.onpointerup = pointerup_handler;
    el.onpointercancel = pointerup_handler;
    el.onpointerout = pointerup_handler;
    el.onpointerleave = pointerup_handler;
}

function remove_event(ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++) {
      if (evCache[i].pointerId == ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
}

window.addEventListener('resize', e => {
  oldTransform = canvas.getTransform();
  
  ctrl = document.getElementById("control")
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight-ctrl.clientHeight-5;
  context.clearRect(0,0, canvas.width, canvas.height);

  canvas.transform(oldTransform)
});

document.getElementById("iterate-button").addEventListener("click", e => {
    e.preventDefault();
    currFractal.iterate();
    updateIterationIndicator();
    draw();
})

document.getElementById("reset-button").addEventListener("click", e => {
    e.preventDefault();
    currFractal.reset();
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

document.getElementById("zoom-in-button").addEventListener("click", e => {
    e.preventDefault();
    zoom(1.1, [canvas.clientWidth/2, canvas.clientHeight/2])
    updateZoomIndicator();
    draw();
})

document.getElementById("zoom-out-button").addEventListener("click", e => {
    e.preventDefault();
    zoom(0.9, [canvas.clientWidth/2, canvas.clientHeight/2])
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

canvas.addEventListener('wheel', e =>{
    e.preventDefault()
    zoom(Math.exp(e.deltaY*-0.01), [e.clientX, e.clientY]);
    updateZoomIndicator();
    draw();
})

updateZoomIndicator();
updateIterationIndicator();
init();
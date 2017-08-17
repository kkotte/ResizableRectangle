// Your code here!

var minimumWidth = 100;
var minimumHeight = 100;
var applicationWindow = {
    x: 400,
    y: 400,
    H: minimumHeight,
    W: minimumWidth,
    edgeThickness: 4,
};

var svgns = "http://www.w3.org/2000/svg";

var dragmode = "";

var rectangleDimensionListener = new RectangleProcessor.RectangleDimensionListener();

var startPos = {
    x: 0,
    y: 0,
};

window.onload = function ()
{
    // Create main application window
    var mainWindow = document.createElementNS(svgns, 'rect');
    mainWindow.id = "ApplicationWindow";
    mainWindow.setAttributeNS(null, 'x', applicationWindow.x);
    mainWindow.setAttributeNS(null, 'y', applicationWindow.y);
    mainWindow.setAttributeNS(null, 'height', applicationWindow.H);
    mainWindow.setAttributeNS(null, 'width', applicationWindow.W);
    mainWindow.setAttribute('class', 'ApplicationWindow');

    // Add drag controls
    mainWindow.addEventListener("mousedown", function (event) {
        dragmode = "trackDisplacement";
        trackMouse(event);
    }, false);

    document.getElementById('svgCanvas').appendChild(mainWindow);

    // Create left window edge
    var leftEdge = document.createElementNS(svgns, 'rect');
    leftEdge.id = "LeftEdge";
    leftEdge.setAttributeNS(null, 'x', applicationWindow.x - applicationWindow.edgeThickness);
    leftEdge.setAttributeNS(null, 'y', applicationWindow.y);
    leftEdge.setAttributeNS(null, 'height', applicationWindow.H);
    leftEdge.setAttributeNS(null, 'width', applicationWindow.edgeThickness);
    leftEdge.setAttribute('class', 'LeftEdge');

    // Add drag controls
    leftEdge.addEventListener("mousedown", function (event) {
        dragmode = "trackLeftX";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(leftEdge);

    // Create right window edge
    var rightEdge = document.createElementNS(svgns, 'rect');
    rightEdge.id = "RightEdge";
    rightEdge.setAttributeNS(null, 'x', applicationWindow.x + applicationWindow.W);
    rightEdge.setAttributeNS(null, 'y', applicationWindow.y);
    rightEdge.setAttributeNS(null, 'height', applicationWindow.H);
    rightEdge.setAttributeNS(null, 'width', applicationWindow.edgeThickness);
    rightEdge.setAttribute('class', 'RightEdge');

    // Add drag controls
    rightEdge.addEventListener("mousedown", function (event) {
        dragmode = "trackRightX";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(rightEdge);

    // Create top window edge
    var topEdge = document.createElementNS(svgns, 'rect');
    topEdge.id = "TopEdge";
    topEdge.setAttributeNS(null, 'x', applicationWindow.x);
    topEdge.setAttributeNS(null, 'y', applicationWindow.y - applicationWindow.edgeThickness);
    topEdge.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    topEdge.setAttributeNS(null, 'width', applicationWindow.W);
    topEdge.setAttribute('class', 'TopEdge');

    // Add drag controls
    topEdge.addEventListener("mousedown", function (event) {
        dragmode = "trackTopY";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(topEdge);

    // Create bottom window edge
    var bottomEdge = document.createElementNS(svgns, 'rect');
    bottomEdge.id = "BottomEdge";
    bottomEdge.setAttributeNS(null, 'x', applicationWindow.x);
    bottomEdge.setAttributeNS(null, 'y', applicationWindow.y + applicationWindow.H);
    bottomEdge.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    bottomEdge.setAttributeNS(null, 'width', applicationWindow.W);
    bottomEdge.setAttribute('class', 'BottomEdge');

    // Add drag controls
    bottomEdge.addEventListener("mousedown", function (event) {
        dragmode = "trackBottomY";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(bottomEdge);

    // Create NE corner
    var neCorner = document.createElementNS(svgns, 'rect');
    neCorner.id = "NECorner";
    neCorner.setAttributeNS(null, 'x', applicationWindow.x - applicationWindow.edgeThickness);
    neCorner.setAttributeNS(null, 'y', applicationWindow.y - applicationWindow.edgeThickness);
    neCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    neCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);
    neCorner.setAttribute('class', 'NECorner');

    // Add drag controls
    neCorner.addEventListener("mousedown", function (event) {
        dragmode = "trackNECorner";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(neCorner);

    // Create SE corner
    var seCorner = document.createElementNS(svgns, 'rect');
    seCorner.id = "SECorner";
    seCorner.setAttributeNS(null, 'x', applicationWindow.x - applicationWindow.edgeThickness);
    seCorner.setAttributeNS(null, 'y', applicationWindow.y + applicationWindow.H);
    seCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    seCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);
    seCorner.setAttribute('class', 'SECorner');

    // Add drag controls
    seCorner.addEventListener("mousedown", function (event) {
        dragmode = "trackSECorner";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(seCorner);

    // Create NW corner
    var nwCorner = document.createElementNS(svgns, 'rect');
    nwCorner.id = "NWCorner";
    nwCorner.setAttributeNS(null, 'x', applicationWindow.x + applicationWindow.W);
    nwCorner.setAttributeNS(null, 'y', applicationWindow.y - applicationWindow.edgeThickness);
    nwCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    nwCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);
    nwCorner.setAttribute('class', 'NWCorner');

    // Add drag controls
    nwCorner.addEventListener("mousedown", function (event) {
        dragmode = "trackNWCorner";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(nwCorner);

    // Create SW corner
    var swCorner = document.createElementNS(svgns, 'rect');
    swCorner.id = "SWCorner";
    swCorner.setAttributeNS(null, 'x', applicationWindow.x + applicationWindow.W);
    swCorner.setAttributeNS(null, 'y', applicationWindow.y + applicationWindow.H);
    swCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    swCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);
    swCorner.setAttribute('class', 'SWCorner');

    // Add drag controls
    swCorner.addEventListener("mousedown", function (event) {
        dragmode = "trackSWCorner";
        trackMouse(event);
    }, false);
    document.getElementById('svgCanvas').appendChild(swCorner);

    document.getElementById("status").innerHTML = "(" + applicationWindow.x + ", " + applicationWindow.y + ") (" + applicationWindow.W + " * " + applicationWindow.H + ") MAX[" + window.innerWidth + ", " + window.innerHeight + "]";

    window.addEventListener("resize", function () { rectangleDimensionListener.updateMaxArea(window.innerWidth, window.innerHeight); });

    rectangleDimensionListener.updateMaxArea(window.innerWidth, window.innerHeight);
    rectangleDimensionListener.updateRectanglePosition(applicationWindow.x, applicationWindow.y, applicationWindow.W, applicationWindow.H);
}

function trackMouse(event) {
    startPos.x = event.pageX;
    startPos.y = event.pageY;
    window.addEventListener("mousemove", onMouseMoved, false);
    window.addEventListener("mouseup", stopTrackingMouse, false);
}

function stopTrackingMouse() {
    window.removeEventListener("mousemove", onMouseMoved, false);
    window.removeEventListener("mouseup", stopTrackingMouse, false);
}

function paintApplicationWindow()
{
    // paint main application window
    var mainWindow = document.getElementById('ApplicationWindow');
    mainWindow.setAttributeNS(null, 'x', applicationWindow.x);
    mainWindow.setAttributeNS(null, 'y', applicationWindow.y);
    mainWindow.setAttributeNS(null, 'height', applicationWindow.H);
    mainWindow.setAttributeNS(null, 'width', applicationWindow.W);

    // paint left window edge
    var leftEdge = document.getElementById('LeftEdge');
    leftEdge.setAttributeNS(null, 'x', applicationWindow.x - applicationWindow.edgeThickness);
    leftEdge.setAttributeNS(null, 'y', applicationWindow.y);
    leftEdge.setAttributeNS(null, 'height', applicationWindow.H);
    leftEdge.setAttributeNS(null, 'width', applicationWindow.edgeThickness);

    // paint right window edge
    var rightEdge = document.getElementById('RightEdge');
    rightEdge.setAttributeNS(null, 'x', applicationWindow.x + applicationWindow.W);
    rightEdge.setAttributeNS(null, 'y', applicationWindow.y);
    rightEdge.setAttributeNS(null, 'height', applicationWindow.H);
    rightEdge.setAttributeNS(null, 'width', applicationWindow.edgeThickness);

    // paint top window edge
    var topEdge = document.getElementById('TopEdge');
    topEdge.setAttributeNS(null, 'x', applicationWindow.x);
    topEdge.setAttributeNS(null, 'y', applicationWindow.y - applicationWindow.edgeThickness);
    topEdge.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    topEdge.setAttributeNS(null, 'width', applicationWindow.W);

    // paint bottom window edge
    var bottomEdge = document.getElementById('BottomEdge');
    bottomEdge.setAttributeNS(null, 'x', applicationWindow.x);
    bottomEdge.setAttributeNS(null, 'y', applicationWindow.y + applicationWindow.H);
    bottomEdge.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    bottomEdge.setAttributeNS(null, 'width', applicationWindow.W);

    // paint NE corner
    var neCorner = document.getElementById('NECorner');
    neCorner.setAttributeNS(null, 'x', applicationWindow.x - applicationWindow.edgeThickness);
    neCorner.setAttributeNS(null, 'y', applicationWindow.y - applicationWindow.edgeThickness);
    neCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    neCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);

    // paint SE corner
    var seCorner = document.getElementById('SECorner');
    seCorner.setAttributeNS(null, 'x', applicationWindow.x - applicationWindow.edgeThickness);
    seCorner.setAttributeNS(null, 'y', applicationWindow.y + applicationWindow.H);
    seCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    seCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);

    // paint NW corner
    var nwCorner = document.getElementById('NWCorner');
    nwCorner.setAttributeNS(null, 'x', applicationWindow.x + applicationWindow.W);
    nwCorner.setAttributeNS(null, 'y', applicationWindow.y - applicationWindow.edgeThickness);
    nwCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    nwCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);

    // paint SW corner
    var swCorner = document.getElementById('SWCorner');
    swCorner.setAttributeNS(null, 'x', applicationWindow.x + applicationWindow.W);
    swCorner.setAttributeNS(null, 'y', applicationWindow.y + applicationWindow.H);
    swCorner.setAttributeNS(null, 'height', applicationWindow.edgeThickness);
    swCorner.setAttributeNS(null, 'width', applicationWindow.edgeThickness);

    document.getElementById("status").innerHTML = "(" + applicationWindow.x + ", " + applicationWindow.y + ") (" + applicationWindow.W + " * " + applicationWindow.H + ") MAX[" + window.innerWidth + ", " + window.innerHeight + "]";
}

function onMouseMoved(event) {

    if (dragmode == "trackDisplacement") {
        applicationWindow.x += event.pageX - startPos.x;
        applicationWindow.y += event.pageY - startPos.y;
        startPos.x = event.pageX;
        startPos.y = event.pageY;
    }

    if (dragmode == "trackLeftX" || dragmode == "trackNECorner" || dragmode == "trackSECorner") {
        var widthDelta = -1 * (event.pageX - startPos.x);
        if (applicationWindow.W + widthDelta < minimumWidth) {
            widthDelta = minimumWidth - applicationWindow.W;
            event.pageX = startPos.x - widthDelta;
        }

        applicationWindow.W += widthDelta;
        applicationWindow.x += event.pageX - startPos.x;
        startPos.x = event.pageX;
    }

    if (dragmode == "trackRightX" || dragmode == "trackNWCorner" || dragmode == "trackSWCorner") {
        var widthDelta = (event.pageX - startPos.x);
        if (applicationWindow.W + widthDelta < minimumWidth) {
            widthDelta = applicationWindow.W - minimumWidth;
            event.pageX = startPos.x + widthDelta;
        }

        applicationWindow.W += widthDelta;
        startPos.x = event.pageX;
    }
    
    if (dragmode == "trackTopY" || dragmode == "trackNECorner" || dragmode == "trackNWCorner") {
        var heightDelta = -1 * (event.pageY - startPos.y);
        if (applicationWindow.H + heightDelta < minimumHeight) {
            heightDelta = minimumHeight - applicationWindow.H;
            event.pageY = startPos.y - heightDelta;
        }

        applicationWindow.H += heightDelta;
        applicationWindow.y += event.pageY - startPos.y;
        startPos.y = event.pageY;
    }

    if (dragmode == "trackBottomY" || dragmode == "trackSWCorner" || dragmode == "trackSECorner") {
        var heightDelta = (event.pageY - startPos.y);
        if (applicationWindow.H + heightDelta < minimumHeight) {
            heightDelta = applicationWindow.H - minimumHeight;
            event.pageY = startPos.y + heightDelta;
        }

        applicationWindow.H += heightDelta;
        startPos.y = event.pageY;
    }

    paintApplicationWindow();

    rectangleDimensionListener.updateRectanglePosition(applicationWindow.x, applicationWindow.y, applicationWindow.W, applicationWindow.H);
}
var midgroundCanvas; // Midground (at normal state)
var midgroundAfterCanvas; // Midground (at zoom state)

var foregroundCanvas; // Foreground (at normal state)
var foregroundAfterCanvas; // Foreground (at zoom state)

var animCanvas; // Canvas to draw lens animation (instruction)

var zoomCanvas; // Zoom background. (the top image)
var foregroundZoomCanvas; // Zoom foreground. (the top image)

var circleMask;
var zoomOverlay;
var zoomBlur;
var zoomSelected;
var preplaceText;
var preplaceTextSpan;
var infoThumb;
var infoThumbImg;
var infoThumbGlowImg;
var infoBox;
var infoBoxImg;
var infoBoxTextHeader;
var infoBoxTextPara;
var infoBoxButton0;
var infoBoxButton1;
var infoBoxButton2;
var infoBoxButton3;
// var isTouchingInfoButton = false;
var drawerButton;
var lens1Button;
var lens2Button;
var dropdownMenu;
var selectedLens = 1; // 1: SMU, 2: Conv
var isVisualprefOn = true;
var isWireframeOn = true;
var isEnlargedView = false;
var isCompareLenses = false;
var visualpreControl;
var wireframeControl;
var visualprefContainer;
var input1;
var input2;
var speed = {
  1: 300,
  2: 165,
  3: 121,
  4: 100,
  5: 88,
  6: 80,
  7: 76,
  8: 73,
  9: 71,
  10: 70,
};

var diff1 = {
  0: 2.3,
  1: 3.51,
  2: 4.72,
  3: 5.93,
  4: 7.14,
  5: 8.35,
  6: 9.56,
  7: 10.77,
  8: 11.98,
  9: 13.19,
  10: 14.4,
};

var diff2 = {
  0: 12.8,
  1: 13.92,
  2: 15.04,
  3: 16.16,
  4: 17.28,
  5: 18.4,
  6: 19.52,
  7: 20.64,
  8: 21.76,
  9: 22.88,
  10: 24,
};

var setBlur = selectedLens === 1 ? diff1[0] : diff2[0];
var forwardInterval;
var backwardInterval;

var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var isIpad = clientWidth == 768;
var isIpadPro = clientWidth == 1024;
var circleRadiusZO = (clientHeight / 4) * 0.9; // the circle radius in zoom overlay
var scale = (circleRadiusZO / 397) * 2;

// list lens
var listLens = [];

var leftSMUScale = 104 / 152;
var leftConvScale = 143 / 212;
var xOffset = clientWidth / 2 - circleRadiusZO;
var yOffset = clientHeight / 4 - circleRadiusZO;

// Left SMU curve in the zoom overlay area on Ipad.
var leftSMUCurveZOIpad = {
  spx: 3 * scale + xOffset,
  spy: 162 * scale + yOffset,
  cpx1: (22.66 * leftSMUScale + 3) * scale + xOffset,
  cpy1: (9.71 * leftSMUScale + 162) * scale + yOffset,
  cpx2: (129.68 * leftSMUScale + 3) * scale + xOffset,
  cpy2: (57.35 * leftSMUScale + 162) * scale + yOffset,
  x1: (147.49 * leftSMUScale + 3) * scale + xOffset,
  y1: (132.25 * leftSMUScale + 162) * scale + yOffset,
  cpx3: (162.13 * leftSMUScale + 3) * scale + xOffset,
  cpy3: (193.8 * leftSMUScale + 162) * scale + yOffset,
  cpx4: (124.59 * leftSMUScale + 3) * scale + xOffset,
  cpy4: (253.77 * leftSMUScale + 162) * scale + yOffset,
  x2: (103.65 * leftSMUScale + 3) * scale + xOffset,
  y2: (281.26 * leftSMUScale + 162) * scale + yOffset,
};

// Left SMU curve in the zoom overlay area on Ipad Pro.
var leftSMUCurveZOIpadPro = leftSMUCurveZOIpad;

var leftSMUCurveZO =
  clientWidth === 768 ? leftSMUCurveZOIpad : leftSMUCurveZOIpadPro;

// Left Conv curve in the zoom overlay area on Ipad.
var leftConvCurveZOIpad = {
  spx: 20 * scale + xOffset,
  spy: 112 * scale + yOffset,
  cpx1: (83.26 * leftConvScale + 20) * scale + xOffset,
  cpy1: (31.06 * leftConvScale + 112) * scale + yOffset,
  cpx2: (194.08 * leftConvScale + 20) * scale + xOffset,
  cpy2: (88.73 * leftConvScale + 112) * scale + yOffset,
  x1: (207.7 * leftConvScale + 20) * scale + xOffset,
  y1: (181.62 * leftConvScale + 112) * scale + yOffset,
  cpx3: (220.21 * leftConvScale + 20) * scale + xOffset,
  cpy3: (266.97 * leftConvScale + 112) * scale + yOffset,
  cpx4: (188.65 * leftConvScale + 20) * scale + xOffset,
  cpy4: (349.61 * leftConvScale + 112) * scale + yOffset,
  x2: (161.68 * leftConvScale + 20) * scale + xOffset,
  y2: (401.71 * leftConvScale + 112) * scale + yOffset,
};

// Left Conv curve in the zoom overlay area on Ipad Pro.
var leftConvCurveZOIpadPro = leftConvCurveZOIpad;

var leftConvCurveZO =
  clientWidth === 768 ? leftConvCurveZOIpad : leftConvCurveZOIpadPro;

// Left curve in the zoom overlay area.
var leftCurveZO = leftSMUCurveZO;

// Right curve in the zoom overlay area.
var rightCurveZO = {
  spx: clientWidth - leftCurveZO.spx,
  spy: leftCurveZO.spy,
  cpx1: clientWidth - leftCurveZO.cpx1,
  cpy1: leftCurveZO.cpy1,
  cpx2: clientWidth - leftCurveZO.cpx2,
  cpy2: leftCurveZO.cpy2,
  x1: clientWidth - leftCurveZO.x1,
  y1: leftCurveZO.y1,
  cpx3: clientWidth - leftCurveZO.cpx3,
  cpy3: leftCurveZO.cpy3,
  cpx4: clientWidth - leftCurveZO.cpx4,
  cpy4: leftCurveZO.cpy4,
  x2: clientWidth - leftCurveZO.x2,
  y2: leftCurveZO.y2,
};

var circleMaskHeight = 2 * lens.desiredRadius;
var circleMaskWidth = clientWidth / (clientHeight / 2 / circleMaskHeight);

scale = circleMaskHeight / 397;
xOffset = (circleMaskWidth - circleMaskHeight) / 2;
yOffset = 0;

// Left SMU curve in the circle mask area on Ipad.
var leftSMUCurveCMIpad = {
  spx: 3 * scale + xOffset,
  spy: 162 * scale + yOffset,
  cpx1: (22.66 * leftSMUScale + 3) * scale + xOffset,
  cpy1: (9.71 * leftSMUScale + 162) * scale + yOffset,
  cpx2: (129.68 * leftSMUScale + 3) * scale + xOffset,
  cpy2: (57.35 * leftSMUScale + 162) * scale + yOffset,
  x1: (147.49 * leftSMUScale + 3) * scale + xOffset,
  y1: (132.25 * leftSMUScale + 162) * scale + yOffset,
  cpx3: (162.13 * leftSMUScale + 3) * scale + xOffset,
  cpy3: (193.8 * leftSMUScale + 162) * scale + yOffset,
  cpx4: (124.59 * leftSMUScale + 3) * scale + xOffset,
  cpy4: (253.77 * leftSMUScale + 162) * scale + yOffset,
  x2: (103.65 * leftSMUScale + 3) * scale + xOffset,
  y2: (281.26 * leftSMUScale + 162) * scale + yOffset,
};

// Left SMU curve in the circle mask area on Ipad Pro.
var leftSMUCurveCMIpadPro = leftSMUCurveCMIpad;

var leftSMUCurveCM =
  clientWidth === 768 ? leftSMUCurveCMIpad : leftSMUCurveCMIpadPro;

// Left Conv curve in the circle mask area on Ipad.
var leftConvCurveCMIpad = {
  spx: 20 * scale + xOffset,
  spy: 112 * scale + yOffset,
  cpx1: (83.26 * leftConvScale + 20) * scale + xOffset,
  cpy1: (31.06 * leftConvScale + 112) * scale + yOffset,
  cpx2: (194.08 * leftConvScale + 20) * scale + xOffset,
  cpy2: (88.73 * leftConvScale + 112) * scale + yOffset,
  x1: (207.7 * leftConvScale + 20) * scale + xOffset,
  y1: (181.62 * leftConvScale + 112) * scale + yOffset,
  cpx3: (220.21 * leftConvScale + 20) * scale + xOffset,
  cpy3: (266.97 * leftConvScale + 112) * scale + yOffset,
  cpx4: (188.65 * leftConvScale + 20) * scale + xOffset,
  cpy4: (349.61 * leftConvScale + 112) * scale + yOffset,
  x2: (161.68 * leftConvScale + 20) * scale + xOffset,
  y2: (401.71 * leftConvScale + 112) * scale + yOffset,
};

// Left Conv curve in the circle mask area on Ipad Pro.
var leftConvCurveCMIpadPro = leftConvCurveCMIpad;

var leftConvCurveCM =
  clientWidth === 768 ? leftConvCurveCMIpad : leftConvCurveCMIpadPro;

// Left curve in the circle mask area.
var leftCurveCM = leftSMUCurveCM;

// Right curve in the circle mask area.
var rightCurveCM = {
  spx: circleMaskWidth - leftCurveCM.spx,
  spy: leftCurveCM.spy,
  cpx1: circleMaskWidth - leftCurveCM.cpx1,
  cpy1: leftCurveCM.cpy1,
  cpx2: circleMaskWidth - leftCurveCM.cpx2,
  cpy2: leftCurveCM.cpy2,
  x1: circleMaskWidth - leftCurveCM.x1,
  y1: leftCurveCM.y1,
  cpx3: circleMaskWidth - leftCurveCM.cpx3,
  cpy3: leftCurveCM.cpy3,
  cpx4: circleMaskWidth - leftCurveCM.cpx4,
  cpy4: leftCurveCM.cpy4,
  x2: circleMaskWidth - leftCurveCM.x2,
  y2: leftCurveCM.y2,
};

var zbX = 0; // The x-coordinate of the zoom blur canvas
var zbY = 0; // The y-coordinate of the zoom blur canvas

var hImgStandard;
var ImgStandard = new Image();
ImgStandard.src = "images/bg/img_midground_good.png";
ImgStandard.onload = function () {
  hImgStandard = Math.round(
    (this.height * document.documentElement.clientWidth) / this.width -
      document.documentElement.clientHeight / 2
  );
};

var fgBlurImg = new Image();
fgBlurImg.src = "images/bg/fg_blur.png";

var isDrawZO = false; // is draw zoom overlay
var isDrawCM = false; // is draw circle mask

// move touch
function handleGestureMove(event) {
  // Check if event is cancelable before trying to prevent it.
  if (event.cancelable) {
    event.preventDefault();
  }

  if (touch.getGesturePosition(event)) {
    if (isEnlargedView || isCompareLenses) {
      switch (lens.checkIfInBackground(touch.getTouchInput())) {
        default:
        case 0: {
          // focus on background
          midgroundCanvas.style.top = "auto";
          midgroundCanvas.style.bottom = `-${hImgStandard}px`;
          midgroundAfterCanvas.style.top = "auto";
          midgroundAfterCanvas.style.bottom = `-${hImgStandard}px`;
          foregroundCanvas.style.bottom = "-500px";
          foregroundAfterCanvas.style.bottom = "-500px";
          zoomCanvas.style.bottom = `-${hImgStandard}px`;
          zbY = 0;
          foregroundZoomCanvas.style.bottom = "-500px";
          break;
        }
        case 1: {
          // focus on midground
          midgroundCanvas.style.top = "auto";
          midgroundCanvas.style.bottom = "0px";
          midgroundAfterCanvas.style.top = "auto";
          midgroundAfterCanvas.style.bottom = "0px";
          foregroundCanvas.style.bottom = "-500px";
          foregroundAfterCanvas.style.bottom = "-500px";
          zoomCanvas.style.bottom = "0px";
          zbY = 0 - hImgStandard;
          foregroundZoomCanvas.style.bottom = "-500px";
          break;
        }
        case 2: {
          // focus on foreground
          midgroundCanvas.style.top = "auto";
          midgroundCanvas.style.bottom = "0px";
          midgroundAfterCanvas.style.top = "auto";
          midgroundAfterCanvas.style.bottom = "0px";
          foregroundCanvas.style.bottom = "0px";
          foregroundAfterCanvas.style.bottom = "0px";
          zoomCanvas.style.bottom = "0px";
          zbY = 0 - hImgStandard;
          foregroundZoomCanvas.style.bottom = "0px";
          break;
        }
      }

      lens.drawCircle(
        midgroundAfterCanvas,
        foregroundAfterCanvas,
        zoomCanvas,
        zoomBlur,
        foregroundZoomCanvas,
        touch.getTouchInput(),
        circleMask,
        zoomCMBlur
      );
      blurZO(zoomOverlay);
      drawCMTouch();
      zoomSelected.style.display = "none";
    } else {
      drawCMTouch();
      lens.drawCircle(
        midgroundAfterCanvas,
        foregroundAfterCanvas,
        touch.getTouchInput()
      );
    }

    lens.showPostplaceMask();
    lens.movePostplaceMask(touch.getTouchInput());

    if (infoBox.style.display !== "flex" && selectedLens == 1) {
      info.showInfoThumb(touch.getTouchInput(), lens.desiredRadius);
      resetInfoBoxSelection();
    } else {
      info.showInfoThumb(
        touch.getTouchInput(),
        lens.desiredRadius,
        selectedLens
      );
      resetInfoBoxSelection();
    }

    info.moveInfoBox(touch.getTouchInput(), lens.desiredRadius);
    info.moveInfoThumb(touch.getTouchInput(), lens.desiredRadius);
  }
}

// start touch
function handleGestureStart(event) {
  if (touch.getGesturePosition(event)) {
    lens.cancelPreplaceAnim();
    lens.hidePreplaceText();
    util.clearCanvases([animCanvas]);

    if (isEnlargedView || isCompareLenses) {
      selectorGroup.style.display = "block";
      visualprefContainer.style.display = "flex";

      if (!isDrawZO) {
        drawZO();
      }

      if (!isDrawCM) {
        drawCMTouch();
      }

      lens.drawCircle(
        midgroundAfterCanvas,
        foregroundAfterCanvas,
        zoomCanvas,
        zoomBlur,
        foregroundZoomCanvas,
        touch.getTouchInput(),
        circleMask,
        zoomCMBlur
      );
      zoomSelected.style.display = "none";
    } else {
      selectorGroup.style.display = "none";
      if (!isDrawCM) {
        drawCMTouch();
      }
      lens.drawCircle(
        midgroundAfterCanvas,
        foregroundAfterCanvas,
        touch.getTouchInput(),
        circleMask,
        zoomCMBlur
      );
    }

    lens.showPostplaceMask();
    lens.movePostplaceMask(touch.getTouchInput());
    // lens.updateTouch(touch.getTouchInput());
    // lens.animPostPlaceNoLoop();
    // info.showInfoBox(touch.getTouchInput(), lens.desiredRadius);
    if (touch.getGesturePosition(event)) {
      if (infoBox.style.display !== "flex" && selectedLens == 1) {
        info.showInfoThumb(touch.getTouchInput(), lens.desiredRadius);
        resetInfoBoxSelection();
      }
    }
  }
}

// end touch
function handleGestureEnd(event) {
  if (event.targetTouches.length <= 2 || !touch.getGesturePosition(event)) {
    resetTouch();
  }
}

// cancel touch
function handleGestureCancel(event) {
  if (event.targetTouches.length <= 2 || !touch.getGesturePosition(event)) {
    resetTouch();
  }
}

function resetTouch() {
  // lens.cancelPostplaceAnim();
  touch.setTouchInput(null);
  // util.clearCanvases(midgroundAfterCanvas, animCanvas);
  util.clearCanvases([midgroundAfterCanvas, foregroundAfterCanvas]);
  // lens.updateTouch(null);
  lens.animPrePlace();
  lens.showPreplaceText();
  lens.clearZoom(zoomCanvas, foregroundZoomCanvas);
  lens.hidePostplaceMask();
  info.hideInfoBox();
  info.hideInfoThumb();
  fillZO();
  isDrawZO = false;
  isDrawCM = false;
  if (isEnlargedView || isCompareLenses) {
    zoomSelected.style.display = "flex";
  }
}

function resetInfoBoxSelection() {
  $(".info-box-button").removeClass("active");
  $("#info-box-button-0").toggleClass("active");
  info.updateInfo("info-box-button-0");
  resizeTextInInfoBox();
}

// when touch btn next to circle
function handleInfoThumbTouchStart(e) {
  info.hideInfoThumb();
  // info.updateEffect("dock-button-0");
  info.showInfoBox(touch.getTouchInput(), lens.desiredRadius);
  resizeTextInInfoBox();
}

// group btn 1 2 3 4 on info box
function handleInfoBoxButtonTouchStart(e) {
  // if (!isTouchingInfoButton) {
  //   isTouchingInfoButton = true;
  $(".info-box-button").removeClass("active");
  $(e.target).toggleClass("active");
  info.updateInfo(e.target.id);
  resizeTextInInfoBox();
  // }
}

function handleInfoBoxButtonTouchEnd(e) {
  // isTouchingInfoButton = false;
  $(".info-box-button").removeClass("active");
  $(e.target).toggleClass("active");
  info.updateInfo(e.target.id);
  resizeTextInInfoBox();
}

function handleEnlargeViewButtonTouchStart(e) {
  if (e.target.alt == "enlargedViewImg") {
    document.getElementById("enlargedView").classList.add("active");
    document.getElementById("compareLenses").classList.remove("active");
    isEnlargedView = true;
    isCompareLenses = false;
  } else {
    document.getElementById("compareLenses").classList.add("active");
    document.getElementById("enlargedView").classList.remove("active");
    isCompareLenses = true;
    isEnlargedView = false;
  }
}

function resizeTextInInfoBox() {
  $("#info-box-text-header").textfill({
    minFontPixels: 15,
    maxFontPixels: 20,
    allowOverflow: true,
  });
  $("#info-box-text-para").textfill({
    minFontPixels: 8,
    maxFontPixels: 14,
    allowOverflow: true,
  });
}

// mask on top part.
function resizeOvalMasks() {
  zoomOverlay.width = clientWidth;
  zoomOverlay.height = clientHeight / 2;

  var zoomOverlayCtx = zoomOverlay.getContext("2d");
  zoomOverlayCtx.fillStyle = "rgba(0, 0, 0, 0.8)";

  zoomOverlayCtx.beginPath();
  zoomOverlayCtx.fillRect(0, 0, clientWidth, clientHeight / 2);
  zoomOverlayCtx.fill();
}

// Calculate the coordinates of the left curve in the zoom overlay
function calcLeftCurveZO(coordinates) {
  leftCurveZO = coordinates;
}

// Calculate the coordinates of the right curve in the zoom overlay
function calcRightCurveZO() {
  rightCurveZO.spx = clientWidth - leftCurveZO.spx;
  rightCurveZO.spy = leftCurveZO.spy;
  rightCurveZO.cpx1 = clientWidth - leftCurveZO.cpx1;
  rightCurveZO.cpy1 = leftCurveZO.cpy1;
  rightCurveZO.cpx2 = clientWidth - leftCurveZO.cpx2;
  rightCurveZO.cpy2 = leftCurveZO.cpy2;
  rightCurveZO.x1 = clientWidth - leftCurveZO.x1;
  rightCurveZO.y1 = leftCurveZO.y1;
  rightCurveZO.cpx3 = clientWidth - leftCurveZO.cpx3;
  rightCurveZO.cpy3 = leftCurveZO.cpy3;
  rightCurveZO.cpx4 = clientWidth - leftCurveZO.cpx4;
  rightCurveZO.cpy4 = leftCurveZO.cpy4;
  rightCurveZO.x2 = clientWidth - leftCurveZO.x2;
  rightCurveZO.y2 = leftCurveZO.y2;
}

// Calculate the coordinates of the left curve in the circle mask
function calcLeftCurveCM(coordinates) {
  leftCurveCM = coordinates;
}

// Calculate the coordinates of the right curve in the circle mask
function calcRightCurveCM() {
  rightCurveCM.spx = circleMaskWidth - leftCurveCM.spx;
  rightCurveCM.spy = leftCurveCM.spy;
  rightCurveCM.cpx1 = circleMaskWidth - leftCurveCM.cpx1;
  rightCurveCM.cpy1 = leftCurveCM.cpy1;
  rightCurveCM.cpx2 = circleMaskWidth - leftCurveCM.cpx2;
  rightCurveCM.cpy2 = leftCurveCM.cpy2;
  rightCurveCM.x1 = circleMaskWidth - leftCurveCM.x1;
  rightCurveCM.y1 = leftCurveCM.y1;
  rightCurveCM.cpx3 = circleMaskWidth - leftCurveCM.cpx3;
  rightCurveCM.cpy3 = leftCurveCM.cpy3;
  rightCurveCM.cpx4 = circleMaskWidth - leftCurveCM.cpx4;
  rightCurveCM.cpy4 = leftCurveCM.cpy4;
  rightCurveCM.x2 = circleMaskWidth - leftCurveCM.x2;
  rightCurveCM.y2 = leftCurveCM.y2;
}

// Fill zoom overlay
function fillZO() {
  zoomOverlay.width = clientWidth;
  zoomOverlay.height = clientHeight / 2;

  var zoomOverlayCtx = zoomOverlay.getContext("2d");
  zoomOverlayCtx.beginPath();
  zoomOverlayCtx.rect(0, 0, clientWidth, clientHeight / 2);
  zoomOverlayCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
  zoomOverlayCtx.fill();
}

// Draw zoom overlay
function drawZO() {
  isDrawZO = true;
  zoomOverlay.width = clientWidth;
  zoomOverlay.height = clientHeight / 2;

  var zoomOverlayCtx = zoomOverlay.getContext("2d");
  zoomOverlayCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
  zoomOverlayCtx.beginPath();
  zoomOverlayCtx.fillRect(0, 0, clientWidth, clientHeight / 2);
  zoomOverlayCtx.fill();

  zoomOverlayCtx.save();
  zoomOverlayCtx.globalCompositeOperation = "destination-out";
  zoomOverlayCtx.beginPath();
  zoomOverlayCtx.arc(
    clientWidth / 2,
    (clientHeight / 4) * 0.95,
    circleRadiusZO,
    0,
    2 * Math.PI,
    false
  );
  zoomOverlayCtx.fill();
  zoomOverlayCtx.restore();
  zoomOverlayCtx.clip();

  // draw curve
  drawCurveZO(zoomOverlay);
  zoomOverlayCtx.clip();

  // blur overlay
  blurZO(zoomOverlay);
}

// draw curve in zoom overlay
function drawCurveZO(zoomOverlay) {
  var zoomOverlayCtx = zoomOverlay.getContext("2d");
  zoomOverlayCtx.beginPath();
  drawLeftCurveZO(zoomOverlay);
  drawRightCurveZO(zoomOverlay);
  zoomOverlayCtx.lineWidth = 5;
  isVisualprefOn
    ? (zoomOverlayCtx.strokeStyle = "rgba(255, 255, 255, 0.8)")
    : (zoomOverlayCtx.strokeStyle = "rgba(0, 0, 0, 0)");
  zoomOverlayCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
  zoomOverlayCtx.stroke();
}

// blur in zoom overlay
function blurZO(canvas) {
  var ctx = canvas.getContext("2d");
  var radiusInt = Math.ceil(circleRadiusZO);

  // create an off-screen canvas
  var bCanvas = zoomBlur.cloneNode();
  var bCtx = bCanvas.getContext("2d");

  // make our clear-cut on the offscreen canvas
  bCtx.drawImage(zoomBlur, 0, 0, zoomBlur.width, zoomBlur.height);
  StackBlur.canvasRGB(
    bCanvas,
    Math.floor(zoomBlur.width / 2 - radiusInt),
    Math.floor(clientHeight / 4 - radiusInt - zbY),
    radiusInt * 2,
    radiusInt * 2,
    setBlur
  );

  // redraw on the visible canvas
  ctx.drawImage(bCanvas, zbX, zbY);
}

// draw left curve in zoom overlay
function drawLeftCurveZO(zoomOverlay) {
  var zoomOverlayCtx = zoomOverlay.getContext("2d");
  zoomOverlayCtx.setLineDash([15, 5]);
  zoomOverlayCtx.moveTo(leftCurveZO.spx, leftCurveZO.spy);
  zoomOverlayCtx.bezierCurveTo(
    leftCurveZO.cpx1,
    leftCurveZO.cpy1,
    leftCurveZO.cpx2,
    leftCurveZO.cpy2,
    leftCurveZO.x1,
    leftCurveZO.y1
  );
  zoomOverlayCtx.bezierCurveTo(
    leftCurveZO.cpx3,
    leftCurveZO.cpy3,
    leftCurveZO.cpx4,
    leftCurveZO.cpy4,
    leftCurveZO.x2,
    leftCurveZO.y2
  );
  zoomOverlayCtx.lineTo(clientWidth / 2 - 2 * circleRadiusZO, leftCurveZO.y2);
  zoomOverlayCtx.lineTo(clientWidth / 2 - 2 * circleRadiusZO, leftCurveZO.spy);
}

// draw right curve in zoom overlay
function drawRightCurveZO(zoomOverlay) {
  var zoomOverlayCtx = zoomOverlay.getContext("2d");
  zoomOverlayCtx.moveTo(rightCurveZO.spx, rightCurveZO.spy);
  zoomOverlayCtx.bezierCurveTo(
    rightCurveZO.cpx1,
    rightCurveZO.cpy1,
    rightCurveZO.cpx2,
    rightCurveZO.cpy2,
    rightCurveZO.x1,
    rightCurveZO.y1
  );
  zoomOverlayCtx.bezierCurveTo(
    rightCurveZO.cpx3,
    rightCurveZO.cpy3,
    rightCurveZO.cpx4,
    rightCurveZO.cpy4,
    rightCurveZO.x2,
    rightCurveZO.y2
  );
  zoomOverlayCtx.lineTo(clientWidth / 2 + 2 * circleRadiusZO, rightCurveZO.y2);
  zoomOverlayCtx.lineTo(clientWidth / 2 + 2 * circleRadiusZO, rightCurveZO.spy);
}

// draw circle mask
function drawCM() {
  isDrawCM = true;
  circleMask.width = circleMaskWidth;
  circleMask.height = circleMaskHeight;
  circleMask.style.borderRadius = circleMaskHeight + "px";

  var circleMaskCtx = circleMask.getContext("2d");
  circleMaskCtx.fillStyle = "rgba(0, 0, 0, 0)";
  circleMaskCtx.beginPath();
  circleMaskCtx.fillRect(0, 0, circleMaskWidth, circleMaskHeight);
  circleMaskCtx.fill();

  circleMaskCtx.save();
  circleMaskCtx.globalCompositeOperation = "destination-out";
  circleMaskCtx.beginPath();
  circleMaskCtx.arc(
    circleMaskWidth / 2,
    circleMaskHeight / 2,
    lens.desiredRadius,
    0,
    2 * Math.PI,
    false
  );
  circleMaskCtx.fill();
  circleMaskCtx.restore();
  circleMaskCtx.clip();

  // draw curve
  drawCurveCM(circleMask);
  circleMaskCtx.clip();

  // blur in circle mask
  blurCM(circleMask);
}

function drawCMTouch() {
  isDrawCM = true;
  circleMask.width = circleMaskWidth;
  circleMask.height = circleMaskHeight;
  circleMask.style.borderRadius = circleMaskHeight + "px";

  var circleMaskCtx = circleMask.getContext("2d");
  circleMaskCtx.fillStyle = "rgba(0, 0, 0, 0)";
  circleMaskCtx.beginPath();
  circleMaskCtx.fillRect(0, 0, circleMaskWidth, circleMaskHeight);
  circleMaskCtx.fill();

  circleMaskCtx.save();
  circleMaskCtx.globalCompositeOperation = "destination-out";
  circleMaskCtx.beginPath();
  circleMaskCtx.arc(
    circleMaskWidth / 2,
    circleMaskHeight / 2,
    lens.desiredRadius,
    0,
    2 * Math.PI,
    false
  );
  circleMaskCtx.fill();
  circleMaskCtx.restore();
  circleMaskCtx.clip();

  // draw curve
  drawCurveCM(circleMask);
  circleMaskCtx.clip();

  // blur in circle mask
  blurCM(circleMask);
}

function drawCurveCM(circleMask) {
  var circleMaskCtx = circleMask.getContext("2d");
  circleMaskCtx.beginPath();
  drawLeftCurveCircleMask(circleMask);
  drawRightCurveCircleMask(circleMask);
  circleMaskCtx.lineWidth = 5;
  isVisualprefOn
    ? (circleMaskCtx.strokeStyle = "rgba(255, 255, 255, 0.8)")
    : (circleMaskCtx.strokeStyle = "rgba(0, 0, 0, 0)");
  circleMaskCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
  circleMaskCtx.stroke();
}

function blurCM(canvas) {
  // var ctx = canvas.getContext("2d");
  // ctx.drawImage(fgBlurImg, 0, 0, circleMaskWidth, circleMaskHeight);

  var ctx = canvas.getContext("2d");
  var radiusInt = Math.ceil(lens.desiredRadius);

  // create an off-screen canvas
  var bCanvas = zoomCMBlur.cloneNode();
  var bCtx = bCanvas.getContext("2d");

  // make our clear-cut on the offscreen canvas
  bCtx.drawImage(zoomCMBlur, 0, 0, zoomCMBlur.width, zoomCMBlur.height);
  StackBlur.canvasRGB(
    bCanvas,
    Math.floor(circleMaskWidth / 2 - radiusInt),
    Math.floor(clientHeight / 4 - radiusInt - zbY),
    radiusInt * 2,
    radiusInt * 2,
    setBlur
  );

  // redraw on the visible canvas
  ctx.drawImage(bCanvas, zbX, zbY);
}

function blurCMTouch(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.drawImage(fgBlurImg, 0, 0, circleMaskWidth + 100, circleMaskHeight + 100);
}

// draw left curve in circle mask
function drawLeftCurveCircleMask(circleMask) {
  var circleMaskCtx = circleMask.getContext("2d");
  circleMaskCtx.setLineDash([15, 5]);
  circleMaskCtx.moveTo(leftCurveCM.spx, leftCurveCM.spy);
  circleMaskCtx.bezierCurveTo(
    leftCurveCM.cpx1,
    leftCurveCM.cpy1,
    leftCurveCM.cpx2,
    leftCurveCM.cpy2,
    leftCurveCM.x1,
    leftCurveCM.y1
  );
  circleMaskCtx.bezierCurveTo(
    leftCurveCM.cpx3,
    leftCurveCM.cpy3,
    leftCurveCM.cpx4,
    leftCurveCM.cpy4,
    leftCurveCM.x2,
    leftCurveCM.y2
  );
  circleMaskCtx.lineTo(
    circleMask.width / 2 - 2 * lens.desiredRadius,
    leftCurveCM.y2
  );
  circleMaskCtx.lineTo(
    circleMask.width / 2 - 2 * lens.desiredRadius,
    leftCurveCM.spy
  );
}

// draw right curve in circle mask
function drawRightCurveCircleMask(circleMask) {
  var circleMaskCtx = circleMask.getContext("2d");
  circleMaskCtx.moveTo(rightCurveCM.spx, rightCurveCM.spy);
  circleMaskCtx.bezierCurveTo(
    rightCurveCM.cpx1,
    rightCurveCM.cpy1,
    rightCurveCM.cpx2,
    rightCurveCM.cpy2,
    rightCurveCM.x1,
    rightCurveCM.y1
  );
  circleMaskCtx.bezierCurveTo(
    rightCurveCM.cpx3,
    rightCurveCM.cpy3,
    rightCurveCM.cpx4,
    rightCurveCM.cpy4,
    rightCurveCM.x2,
    rightCurveCM.y2
  );
  circleMaskCtx.lineTo(
    circleMask.width / 2 + 2 * lens.desiredRadius,
    rightCurveCM.y2
  );
  circleMaskCtx.lineTo(
    circleMask.width / 2 + 2 * lens.desiredRadius,
    rightCurveCM.spy
  );
}

// dropdownMenu in header
function handleDrawerButtonTouchStart(e) {
  if (dropdownMenu.style.bottom == "50%") {
    // dropdownMenu.style.bottom = "100%";
    hideDropDownMenu(e);
  } else {
    // dropdownMenu.style.bottom = "50%";
    showDropDownMenu(e);
  }
}

function showDropDownMenu(e) {
  dropdownMenu.style.bottom = "50%";
}

function hideDropDownMenu(e) {
  dropdownMenu.style.bottom = "100%";
}

// "see max" btn on bottom left
function handleLens1ButtonTouchStart(e) {
  if (selectedLens != 1) {
    selectedLens = 1;
    lens1Button.classList.add("on");
    lens2Button.classList.remove("on");

    resetThumnb();
    updateBlur(0);
    // isVisualprefOn = false;
    // handleVisualprefButtonTouchStart(e);
    lens.handleBackgroundChange(1);
    lens.drawCircle(
      midgroundAfterCanvas,
      foregroundAfterCanvas,
      zoomCanvas,
      zoomBlur,
      foregroundZoomCanvas,
      touch.getTouchInput(),
      circleMask,
      zoomCMBlur
    );
    if (touch.getGesturePosition(event)) {
      if (infoBox.style.display !== "flex" && selectedLens == 1) {
        info.showInfoThumb(touch.getTouchInput(), lens.desiredRadius);
        resetInfoBoxSelection();
      }
    }

    if (isIpad) {
      leftSMUCurveZO = leftSMUCurveZOIpad;
      leftSMUCurveCM = leftSMUCurveCMIpad;
    } else if (isIpadPro) {
      leftSMUCurveZO = leftSMUCurveZOIpadPro;
      leftSMUCurveCM = leftSMUCurveCMIpadPro;
    }

    // Calculate the coordinates of the left and right curve in zoom overlay
    calcLeftCurveZO(leftSMUCurveZO);
    calcRightCurveZO();
    drawZO();

    // Calculate the coordinates of the left and right curve in circle mask
    calcLeftCurveCM(leftSMUCurveCM);
    calcRightCurveCM();
    drawCMTouch();
  }
}

// "conv" btn on bottom left
function handleLens2ButtonTouchStart(e) {
  // hideSeemaxAbbreviation();
  if (selectedLens == 1) {
    selectedLens = 2;
    lens1Button.classList.remove("on");
    lens2Button.classList.add("on");

    resetThumnb();
    updateBlur(0);
    // isVisualprefOn = false;
    // handleVisualprefButtonTouchStart(e);
    lens.handleBackgroundChange(2);
    lens.drawCircle(
      midgroundAfterCanvas,
      foregroundAfterCanvas,
      zoomCanvas,
      zoomBlur,
      foregroundZoomCanvas,
      touch.getTouchInput(),
      circleMask,
      zoomCMBlur
    );
    if (touch.getGesturePosition(event)) {
      if (selectedLens == 2) {
        info.showInfoThumb(
          touch.getTouchInput(),
          lens.desiredRadius,
          selectedLens
        );
        resetInfoBoxSelection();
      }
    }

    if (isIpad) {
      leftConvCurveZO = leftConvCurveZOIpad;
      leftConvCurveCM = leftConvCurveCMIpad;
    } else if (isIpadPro) {
      leftConvCurveZO = leftConvCurveZOIpadPro;
      leftConvCurveCM = leftConvCurveCMIpadPro;
    }

    // Calculate the coordinates of the left and right curve in zoom overlay
    calcLeftCurveZO(leftConvCurveZO);
    calcRightCurveZO();
    drawZO();

    // Calculate the coordinates of the left and right curve in circle mask
    calcLeftCurveCM(leftConvCurveCM);
    calcRightCurveCM();
    drawCMTouch();
  }
}

// "visual preference" btn on dropdown menu
function handleVisualprefButtonTouchStart(e) {
  if (isVisualprefOn) {
    isVisualprefOn = false;
    visualpreControl.classList.remove("on");
    //visualprefContainer.style.display = "none";
  } else {
    isVisualprefOn = true;
    visualpreControl.classList.add("on");
    visualprefContainer.style.display = "flex";
  }
}

// "abbreviation line" btn on dropdown menu
function handleWireframeButtonTouchStart(e) {
  if (isWireframeOn) {
    isWireframeOn = false;
    wireframeControl.classList.remove("on");
    // hideAbbreviation();
  } else {
    isWireframeOn = true;
    wireframeControl.classList.add("on");
    // showAbbreviation();
  }
}

// visual preference bar on top part
function handleInputTouchEnd(e) {
  if (selectedLens == 1) {
    if (parseFloat(input1.value) > parseFloat(input2.value)) {
      moveThumbForward();
    } else if (parseFloat(input1.value) < parseFloat(input2.value)) {
      moveThumbBackward();
    }
  }
}

function getDiff() {
  return Math.abs(input1.value - input2.value);
}

// move Thumb Forward on visual preference bar
function moveThumbForward() {
  var index = getDiff();
  var intv = 0;
  clearInterval(forwardInterval);
  clearInterval(backwardInterval);
  forwardInterval = setInterval(() => {
    if (parseFloat(input1.value) > parseFloat(input2.value)) {
      input2.value = parseFloat(input2.value) + 1;
      input2.parentNode.style.setProperty(`--${input2.id}`, +input2.value);
      updateBlur(getDiff());
    } else {
      updateBlur(0);
      clearInterval(forwardInterval);
    }
  }, intv);
}

// move Thumb Backward on visual preference bar
function moveThumbBackward() {
  var index = getDiff();
  var intv = 0;
  clearInterval(forwardInterval);
  clearInterval(backwardInterval);
  backwardInterval = setInterval(() => {
    if (parseFloat(input1.value) < parseFloat(input2.value)) {
      input2.value = parseFloat(input2.value) - 1;
      input2.parentNode.style.setProperty(`--${input2.id}`, +input2.value);
      updateBlur(getDiff());
    } else {
      updateBlur(0);
      clearInterval(backwardInterval);
    }
  }, intv);
}

function resetThumnb() {
  input1.value = 0;
  input2.value = 0;
  input1.parentNode.style.setProperty(`--${input1.id}`, +0);
  input2.parentNode.style.setProperty(`--${input2.id}`, +0);
}

function updateBlur(d) {
  var diff = selectedLens == 1 ? diff1[d] : diff2[d];
  //console.log(diff);
  setBlur = diff;
  drawZO();
  drawCM();
}

window.onload = function init() {
  midgroundCanvas = document.getElementById("midgroundCanvas");
  midgroundAfterCanvas = document.getElementById("midgroundAfterCanvas");
  foregroundCanvas = document.getElementById("foregroundCanvas");
  foregroundAfterCanvas = document.getElementById("foregroundAfterCanvas");
  animCanvas = document.getElementById("animCanvas");
  zoomCanvas = document.getElementById("zoomCanvas");
  foregroundZoomCanvas = document.getElementById("foregroundZoomCanvas");
  circleMask = document.getElementById("circle-mask");
  zoomCMBlur = document.getElementById("zoomcm_blur");
  zoomOverlay = document.getElementById("zoom-overlay");
  zoomBlur = document.getElementById("zoom_blur");
  zoomSelected = document.getElementById("zoom-selected");
  preplaceTextGroup = document.getElementById("preplace-text-group");
  preplaceText = document.getElementById("preplace-text");
  infoThumb = document.getElementById("info-thumb");
  infoThumbImg = document.getElementById("info-thumb-img");
  infoThumbGlowImg = document.getElementById("info-thumb-glow-img");
  infoBox = document.getElementById("info-box");
  infoBoxImg = document.getElementById("info-box-img");
  infoBoxTextHeader = document.getElementById("info-box-text-header");
  infoBoxTextPara = document.getElementById("info-box-text-para");
  infoBoxButton0 = document.getElementById("info-box-button-0");
  infoBoxButton1 = document.getElementById("info-box-button-1");
  infoBoxButton2 = document.getElementById("info-box-button-2");
  infoBoxButton3 = document.getElementById("info-box-button-3");
  drawerButton = document.getElementById("drawer-button");
  lens1Button = document.getElementById("lens1-button");
  lens2Button = document.getElementById("lens2-button");
  dropdownMenu = document.getElementById("dropdown-menu");
  visualpreControl = document.getElementById("visualpref-control");
  wireframeControl = document.getElementById("wireframe-control");
  input1 = document.getElementById("v2");
  input2 = document.getElementById("v0");
  visualprefContainer = document.getElementById("visualpref-container");
  selectorGroup = document.getElementById("selector_group");

  util.resize([
    midgroundCanvas,
    midgroundAfterCanvas,
    foregroundCanvas,
    foregroundAfterCanvas,
    animCanvas,
    zoomCanvas,
    zoomBlur,
    foregroundZoomCanvas,
    circleMask,
    zoomCMBlur
  ]);
  lens.drawBgImg(
    midgroundCanvas,
    foregroundCanvas,
    zoomCanvas,
    zoomBlur,
    foregroundZoomCanvas,
    zoomCMBlur
  );
  lens.prepLens(animCanvas, preplaceTextGroup, preplaceText, circleMask);
  // lens.updateTouch(null);
  lens.animPrePlace();
  touch.prepTouch(lens.desiredRadius, lens.noOfLegs);
  info.prepInfo(
    infoThumb,
    infoThumbImg,
    infoThumbGlowImg,
    infoBox,
    infoBoxImg,
    infoBoxTextHeader,
    infoBoxTextPara,
    infoBoxButton0,
    infoBoxButton1,
    infoBoxButton2,
    infoBoxButton3
  );

  animCanvas.addEventListener("touchstart", this.handleGestureStart, true);
  animCanvas.addEventListener("touchmove", this.handleGestureMove, true);
  animCanvas.addEventListener("touchend", this.handleGestureEnd, true);
  animCanvas.addEventListener("touchcancel", this.handleGestureCancel, true);

  resizeTextInInfoBox();
  resizeOvalMasks();
  info.updateEffect("dock-button-0");

  $(".no-zoom").bind("touchend", function (e) {
    e.preventDefault();
    // Add your code here.
    $(this).click();
    // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
  });

  addEventListener(
    "input",
    (e) => {
      var _t = e.target;
      _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
      updateBlur(getDiff());
    },
    false
  );
};

window.onresize = function () {
  util.resize([
    midgroundCanvas,
    midgroundAfterCanvas,
    foregroundCanvas,
    foregroundAfterCanvas,
    animCanvas,
    zoomCanvas,
    zoomBlur,
    foregroundZoomCanvas,
    circleMask,
    zoomCMBlur
  ]);
  lens.drawBgImg(
    midgroundCanvas,
    foregroundCanvas,
    zoomCanvas,
    zoomBlur,
    foregroundZoomCanvas,
    zoomCMBlur
  );
};

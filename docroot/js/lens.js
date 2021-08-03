var lens = (function () {
  var animCanvas;
  var preplaceTextGroup;
  var preplaceText;
  var postplaceCircleMask;
  var hImgStandard;
  /* Prepare images for backgrounds (including many types of background). */

  // Bad version: when not zoom yet.
  var midgroundImg = new Image();
  var foregroundImg = new Image();

  midgroundImg.src = "images/bg/img_midground_bad.jpg";
  foregroundImg.src = "images/bg/img_foreground_bad.png";

  // Good version: when zoom.
  var midgroundAfterImgSeemax = new Image();
  var middlegroundAfterImgStandard = new Image();
  var foregroundAfterImg = new Image();
  var ZBImg = new Image(); // Image in canvas blur zoom

  ZBImg.src = "images/bg/img_midground_good.png";
  midgroundAfterImgSeemax.src = "images/bg/img_midground_good.png";
  // middlegroundAfterImgStandard.src = "images/bg/img_midground_standard_good.png"
  middlegroundAfterImgStandard.src = "images/bg/img_midground_good.png";
  middlegroundAfterImgStandard.onload = function () {
    hImgStandard = Math.round(
      (this.height * document.documentElement.clientWidth) / this.width -
        document.documentElement.clientHeight / 2
    );
  };

  foregroundAfterImg.src = "images/bg/img_foreground_good.png";

  // DEFAULT: choose image 'ImgSeemax'.
  var midgroundAfterImg = midgroundAfterImgSeemax;
  /* Properties of the lens */

  var desiredRadius = 170;
  var desireDiameter = desiredRadius * 2;
  var noOfLegs = 3;

  var currentPosition = 1; // 0=background, 1=middleground, 2=foreground

  var offsetY = document.documentElement.clientHeight / 2;
  var pageX = document.documentElement.clientWidth;
  var zoom = offsetY / desireDiameter;
  zoom = Math.round(parseFloat(zoom) * 10)/10 - 0.02;

  var zoomX = zoom - pageX / (pageX * zoom);
  zoomX = zoomX >= 0.8 && zoomX <= 0.9 ? 0.9 : parseFloat(zoomX.toFixed(1));
  // var zoomX =
  //   pageX > 768
  //     ? pageX / 768 + pageX / 768 / 10
  //     : pageX / 768 - pageX / 768 / 10;
  // zoomX = parseFloat(zoomX.toFixed(1));
  /* Animation for instruction of the lens */
  var preplaceImages = {};
  var preplaceImgPath = "images/animations/pre_placement";
  var preplaceTotalFrames = 74;
  var preplaceDuration = 2150;
  var preplaceTimePerFrame = preplaceDuration / preplaceTotalFrames;
  var timeWhenLastUpdatePreplace;
  var timeFromLastUpdatePreplace;
  var preplaceFrameNo = 0;
  var preplaceId;

  function handleBackgroundChange(selectedLens) {
    switch (selectedLens) {
      default:
      case 1: {
        midgroundAfterImg = midgroundAfterImgSeemax;
        break;
      }
      case 2: {
        midgroundAfterImg = middlegroundAfterImgStandard;
        break;
      }
    }
  }

  function scaleToFillImage(canvas, img) {
    var context = canvas.getContext("2d");
    // get the scale
    var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    var x = canvas.width / 2 - (img.width / 2) * scale;
    var y = canvas.height / 2 - (img.height / 2) * scale;
    // context.filter = `blur(30px) opacity(5%)`;
    // context.filter = "url('#svgBlur')"
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
    // context.drawImage(img, 100, 100, img.width * scale, img.height * scale);
  }

  function clearZoom(zoomCanvas, foregroundZoomCanvas) {
    var zoomY = (offsetY + hImgStandard) / desireDiameter;
    let touchInput = {
      center: {
        x: (document.documentElement.clientWidth * 1) / 2,
        y: (document.documentElement.clientHeight * 3) / 4,
      },
    };
    foregroundZoomCanvas
      .getContext("2d")
      .clearRect(0, 0, foregroundZoomCanvas.width, foregroundZoomCanvas.height);
    var zoomContext = zoomCanvas.getContext("2d");
    zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomContext.setTransform(
      zoom,
      0,
      0, // No skewing
      zoom,
      -(
        util.clamp(
          touchInput.center.x,
          desiredRadius,
          zoomCanvas.width - desiredRadius
        ) - desiredRadius
      ) * zoomX,
      -(
        util.clamp(
          touchInput.center.y,
          desiredRadius + offsetY,
          zoomCanvas.height +
            offsetY -
            desiredRadius -
            (zoomCanvas.height - offsetY)
        ) -
        desiredRadius -
        offsetY
      ) * zoomY
    );
    // (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset * 0.95) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - zoomCanvas.height * 0.3 / 1.3)

    drawBgImgAfter(zoomCanvas, midgroundImg);
  }

  // Only zoom if touch inside the bottom image.
  function shouldRenderZoom(touchInput) {
    // return touchInput.center.x < document.documentElement.clientWidth * 0.7
    // && touchInput.center.x > document.documentElement.clientWidth * 0.25
    // && touchInput.center.y > document.documentElement.clientWidth * 0.65

    return (
      touchInput.center.x <= document.documentElement.clientWidth &&
      touchInput.center.x > 0 &&
      touchInput.center.y > document.documentElement.clientHeight / 2
    );
  }

  function drawCircle(
    midgroundAfterCanvas,
    foregroundAfterCanvas,
    zoomCanvas,
    zoomBlur,
    foregroundZoomCanvas,
    touchInput,
    circleMask,
    zoomCMBlur
  ) {
    /*console.log(circleMask.style.top);
    console.log(circleMask.style.left);
    parseInt(circleMask.style.left, 10),
    parseInt(circleMask.style.top, 10)*/

    var cmLeft = parseInt(circleMask.style.left, 10);
    var cmTop = parseInt(circleMask.style.top, 10);
    var cmHeight = circleMask.height;
    var cmWidth = circleMask.width;

    var moveX = -(cmLeft * zoom);

    var zoomY = (offsetY + hImgStandard) / desireDiameter;
    // Only draw if touched.
    if (touchInput !== null && typeof touchInput !== "undefined") {
      // Get contexts of canvases.
      var midgroundAfterContext = midgroundAfterCanvas.getContext("2d");
      var foregroundAfterContext = foregroundAfterCanvas.getContext("2d");
      var zoomContext = zoomCanvas.getContext("2d");
      var ZBContext = zoomBlur.getContext("2d");
      var ZBCMContext = zoomCMBlur.getContext("2d");
      var foregroundZoomContext = foregroundZoomCanvas.getContext("2d");

      var moveZCMBlurY = -(cmTop - (clientHeight / 2));

      // Clear the whole canvases.
      midgroundAfterContext.clearRect(
        0,
        0,
        midgroundAfterCanvas.width,
        midgroundAfterCanvas.height
      );
      foregroundAfterContext.clearRect(
        0,
        0,
        foregroundAfterCanvas.width,
        foregroundAfterCanvas.height
      );
      foregroundZoomContext.clearRect(
        0,
        0,
        foregroundZoomCanvas.width,
        foregroundZoomCanvas.height
      );

      if (currentPosition == 0) {
        // background
        midgroundAfterContext.save();
        midgroundAfterContext.beginPath();
        midgroundAfterContext.arc(
          touchInput.center.x, // Center X.
          touchInput.center.y +
            (midgroundAfterCanvas.height - offsetY) -
            offsetY -
            hImgStandard, // Center Y.
          desiredRadius, // Radius.
          0,
          Math.PI * 2 // From 0 to 360 degree.
        );
        midgroundAfterContext.closePath();
        midgroundAfterContext.clip();

        drawBgImgAfter(midgroundAfterCanvas, midgroundAfterImg);
        midgroundAfterContext.restore();
        if (shouldRenderZoom(touchInput)) {
          zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
          zoomContext.setTransform(
            zoom,
            0,
            0,
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomCanvas.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );
          drawBgImgAfter(zoomCanvas, midgroundAfterImg);

          // zoom blur
          ZBContext.clearRect(0, 0, zoomBlur.width, zoomBlur.height);
          ZBContext.setTransform(
            zoom,
            0,
            0,
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomBlur.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );
          ZBContext.filter = "blur(p16.2x)";
          drawBgImgAfter(zoomBlur, ZBImg);

          // CM Zoom blur
          ZBCMContext.clearRect(0, 0, zoomCMBlur.width, zoomCMBlur.height);
          ZBCMContext.setTransform(
            1,
            0,
            0, // No skewing
            1,
            -cmLeft,
            moveZCMBlurY
          );
          drawBgImgAfter(zoomCMBlur, ZBImg);
        }
      } else if (currentPosition == 1) {
        // middleground
        // Save current state of the canvas (here is the clipping).
        midgroundAfterContext.save();
        /* Start to draw a circle */
        midgroundAfterContext.beginPath();
        midgroundAfterContext.arc(
          touchInput.center.x, // Center X.
          touchInput.center.y +
            (midgroundAfterCanvas.height - offsetY) -
            offsetY, // Center Y.
          desiredRadius, // Radius.
          0,
          Math.PI * 2 // From 0 to 360 degree.
        );
        midgroundAfterContext.closePath();

        // Clip surrounding, only keep the circle to draw on it.
        midgroundAfterContext.clip();

        // Draw the clear image in front of the blur one.
        drawBgImgAfter(midgroundAfterCanvas, midgroundAfterImg);

        // Clear the clipping by restore canvas state.
        midgroundAfterContext.restore();
        /* Zoom top image */
        if (shouldRenderZoom(touchInput)) {
          // Clear canvas before drawing.
          zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
          zoomContext.setTransform(
            zoom,
            0,
            0, // No skewing
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomCanvas.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );

          drawBgImgAfter(zoomCanvas, midgroundAfterImg);

          // zoom blur
          ZBContext.clearRect(0, 0, zoomBlur.width, zoomBlur.height);
          ZBContext.setTransform(
            zoom,
            0,
            0, // No skewing
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomBlur.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );
          drawBgImgAfter(zoomBlur, ZBImg);

          // CM Zoom blur
          ZBCMContext.clearRect(0, 0, zoomCMBlur.width, zoomCMBlur.height);
          ZBCMContext.setTransform(
            1,
            0,
            0, // No skewing
            1,
            -cmLeft,
            moveZCMBlurY
          );
          drawBgImgAfter(zoomCMBlur, ZBImg);
        }
      } else {
        // foreground
        // Save current state of the canvas (here is the clipping).
        foregroundAfterContext.save();
        /* Start to draw a circle */
        foregroundAfterContext.beginPath();
        foregroundAfterContext.arc(
          touchInput.center.x, // Center X.
          touchInput.center.y +
            (foregroundAfterCanvas.height - offsetY) -
            offsetY, // Center Y.
          desiredRadius, // Radius.
          0,
          Math.PI * 2 // From 0 to 360 degree.
        );
        foregroundAfterContext.closePath();
        // Clip surrounding, only keep the circle to draw on it.
        foregroundAfterContext.clip();
        // Draw the clear image in front of the blur one.
        drawBgImgAfter(foregroundAfterCanvas, foregroundAfterImg);
        // Clear the clipping by restore canvas state.
        foregroundAfterContext.restore();

        if (shouldRenderZoom(touchInput)) {
          zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
          zoomContext.setTransform(
            zoom,
            0,
            0, // No skewing
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomCanvas.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );
          // (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset * 0.95) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - zoomCanvas.height * 0.3 / 1.3)
          drawBgImgAfter(zoomCanvas, midgroundAfterImg);

          // zoom blur
          ZBContext.clearRect(0, 0, zoomBlur.width, zoomBlur.height);
          ZBContext.setTransform(
            zoom,
            0,
            0, // No skewing
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomBlur.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );
          drawBgImgAfter(zoomBlur, foregroundAfterImg);

          // CM Zoom blur
          ZBCMContext.clearRect(0, 0, zoomCMBlur.width, zoomCMBlur.height);
          ZBCMContext.setTransform(
            1,
            0,
            0, // No skewing
            1,
            -cmLeft,
            moveZCMBlurY
          );
          drawBgImgAfter(zoomCMBlur, foregroundAfterImg);

          // foreground
          foregroundZoomContext.setTransform(
            zoom,
            0,
            0, // No skewing
            zoom,
            moveX,
            -(
              util.clamp(
                touchInput.center.y,
                desiredRadius + offsetY,
                zoomCanvas.height + offsetY - desiredRadius - hImgStandard
              ) -
              desiredRadius -
              offsetY
            ) * zoomY
          );
          drawBgImgAfter(foregroundZoomCanvas, foregroundAfterImg);
        }
      }
    }
  }

  function drawBgImg(
    middlegroundCanvas,
    foregroundCanvas,
    zoomCanvas,
    foregroundZoomCanvas
  ) {
    scaleToFillImage(middlegroundCanvas, midgroundImg);
    scaleToFillImage(foregroundCanvas, foregroundImg);
    clearZoom(zoomCanvas, foregroundZoomCanvas);
  }

  function drawBgImgAfter(canvas, bgImg) {
    scaleToFillImage(canvas, bgImg);
  }

  function clearAnimation() {
    var context = animCanvas.getContext("2d");
    context.clearRect(0, 0, animCanvas.width, animCanvas.height);
    requestAnimationFrame(clearAnimation);
  }

  function animPrePlace(startTime) {
    var context = animCanvas.getContext("2d");

    // Get the current image in the animation.
    var preplaceImg = preplaceImages[preplaceFrameNo];
    // Calculate where to draw animation image on canvas.
    var x = (animCanvas.width - desireDiameter) / 2.0;
    var y =
      (animCanvas.height - desireDiameter) / 2.0 +
      (animCanvas.height - offsetY) / 2.0;
    // Clear old animation image before drawing a new one.
    context.clearRect(x, y, desireDiameter, desireDiameter);

    // Draw animation image.
    context.drawImage(preplaceImg, x, y, desireDiameter, desireDiameter);

    /* Define the next image in the animation. */

    // Update new time
    if (!timeWhenLastUpdatePreplace) timeWhenLastUpdatePreplace = startTime;

    timeFromLastUpdatePreplace = startTime - timeWhenLastUpdatePreplace;

    // If the image shows long enough.
    if (timeFromLastUpdatePreplace > preplaceTimePerFrame) {
      // Update current time.
      timeWhenLastUpdatePreplace = startTime;

      // Reset to the first image when the animation reaches its end.
      // Othewise, +1.
      if (preplaceFrameNo >= preplaceTotalFrames) {
        preplaceFrameNo = 0;
      } else {
        preplaceFrameNo = preplaceFrameNo + 1;
      }
    }

    // Request to draw next frame.
    preplaceId = requestAnimationFrame(animPrePlace);
  }

  function prepLens(canvas, textGroup, text, circleMask) {
    // Asign views.
    animCanvas = canvas;
    preplaceTextGroup = textGroup;
    preplaceText = text;
    postplaceCircleMask = circleMask;

    // Prepare images for animation.
    for (var i = 0; i <= preplaceTotalFrames; i++) {
      var img = new Image();
      img.src =
        preplaceImgPath + "/preplace_00000_000" + ("0" + i).slice(-2) + ".png";
      preplaceImages[i] = img;
    }
  }

  function cancelPreplaceAnim() {
    if (preplaceId !== null) {
      cancelAnimationFrame(preplaceId);
      clearAnimation();
      preplaceId = null;
    }
  }

  // function cancelPostplaceAnim() {
  //   cancelAnimationFrame(postplaceId);
  // }

  function showPreplaceText() {
    preplaceTextGroup.style.display = "flex";
  }

  function hidePreplaceText() {
    preplaceTextGroup.style.display = "none";
  }

  function checkIfInBackground(touchInput) {
    if (touchInput.center.y < document.documentElement.clientHeight * 0.7) {
      currentPosition = 0;
    } else if (
      touchInput.center.y > document.documentElement.clientHeight * 0.8 &&
      touchInput.center.x > document.documentElement.clientWidth * 0.3 &&
      touchInput.center.x < document.documentElement.clientWidth * 0.7
    ) {
      currentPosition = 2;
    } else {
      currentPosition = 1;
    }
    return currentPosition;
  }

  function showPostplaceMask() {
    postplaceCircleMask.style.display = "flex";
    // postplaceLeftOvalMask.style.display = "flex";
    // postplaceRightOvalMask.style.display = "flex";
  }

  function hidePostplaceMask() {
    postplaceCircleMask.style.display = "none";
    // postplaceLeftOvalMask.style.display = "none";
    // postplaceRightOvalMask.style.display = "none";
  }

  function movePostplaceMask(touchInput) {
    postplaceCircleMask.style.left =
      touchInput.center.x - postplaceCircleMask.width / 2 + "px";
    postplaceCircleMask.style.top = touchInput.center.y - desiredRadius + "px";
    // postplaceLeftOvalMask.style.left = (touchInput.center.x - desiredRadius) - 20 + "px";
    // postplaceLeftOvalMask.style.top = touchInput.center.y - 80 + "px";
    // postplaceRightOvalMask.style.left = (touchInput.center.x) +20 + "px";
    // postplaceRightOvalMask.style.top = touchInput.center.y - 80 + "px";
  }

  return {
    prepLens: prepLens,
    noOfLegs: noOfLegs,
    // updateTouch: updateTouch,
    desiredRadius: desiredRadius,
    zoom: zoom,
    scaleToFillImage: scaleToFillImage,
    drawCircle: drawCircle,
    drawBgImg: drawBgImg,
    drawBgImgAfter: drawBgImgAfter,
    animPrePlace: animPrePlace,
    // animPostPlaceNoLoop: animPostPlaceNoLoop,
    // animPostPlace: animPostPlace,
    cancelPreplaceAnim: cancelPreplaceAnim,
    // cancelPostplaceAnim: cancelPostplaceAnim,
    handleBackgroundChange: handleBackgroundChange,
    showPreplaceText: showPreplaceText,
    hidePreplaceText: hidePreplaceText,
    checkIfInBackground: checkIfInBackground,
    showPostplaceMask: showPostplaceMask,
    hidePostplaceMask: hidePostplaceMask,
    movePostplaceMask: movePostplaceMask,
    clearZoom: clearZoom,
  };
})();

var util = (function () {
  var hImgStandard;
  var ImgStandard = new Image();
  ImgStandard.src = "images/bg/img_midground_good.png";
  ImgStandard.onload = function () {
    hImgStandard = Math.round(
      (this.height * document.documentElement.clientWidth) / this.width -
        document.documentElement.clientHeight / 2
    );
  };

  function resize(canvases) {
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      canvas.width = document.documentElement.clientWidth;
      // canvas.height = (document.documentElement.clientHeight / 2) * 1.3;
      canvas.height = document.documentElement.clientHeight / 2 + hImgStandard;
    }
  }

  function clearCanvases(canvases) {
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  return {
    resize: resize,
    clearCanvases: clearCanvases,
    clamp: clamp,
  };
})();

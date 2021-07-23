var info = (function () {
  var infoThumbHeight = 102;
  var infoThumbWidth = 144;
  var infoThumbPadding = 0;
  var infoBoxHeight = 380;
  var infoBoxWidth = 180;
  var infoBoxPadding = 40;

  var selectedInfo = [
    {
      img: "images/info/img_seemax_1.png",
      header: "Insight Technology",
      para: "Co-create your lens with your unique visual preferences, your needs, and your viewing habits.",
    },
    {
      img: "images/info/img_seemax_2.gif",
      header: "See more, search less",
      para: "Up to 40,000 designs are analyzed to find the perfect match for your prescription. To provide you a seemingly boundless view with minimal visual distractions.",
    },
    {
      img: "images/info/img_seemax_3.gif",
      header: "See things the way you like",
      para: "The all-new sensitivity personalization helps you to see your world in a new way. With SeeMax Ultimate, you are in control of what matters most.",
    },
    {
      img: "images/info/img_seemax_4.gif",
      header: "Seamless Switch",
      para: "No matter what lens you were wearing before, everything feels instantly familiar.",
    },
  ];
  var info = [
    [
      {
        img: "images/info/img_seemax_1.png",
        header: "Insight Technology",
        para: "Co-create your lens with your unique visual preferences, your needs, and your viewing habits.",
      },
      {
        img: "images/info/img_seemax_2.gif",
        header: "See more, search less",
        para: "Up to 40,000 designs are analyzed to find the perfect match for your prescription. To provide you a seemingly boundless view with minimal visual distractions.",
      },
      {
        img: "images/info/img_seemax_3.gif",
        header: "See things the way you like",
        para: "The all-new sensitivity personalization helps you to see your world in a new way. With SeeMax Ultimate, you are in control of what matters most.",
      },
      {
        img: "images/info/img_seemax_4.gif",
        header: "Seamless Switch",
        para: "No matter what lens you were wearing before, everything feels instantly familiar.",
      },
    ],
  ];
  var infoThumb = null;
  var infoThumbImg = null;
  var infoBox = null;
  var infoBoxImg = null;
  var infoBoxTextHeader = null;
  var infoBoxTextPara = null;
  var infoBoxButton0 = null;
  var infoBoxButton1 = null;
  var infoBoxButton2 = null;
  var infoBoxButton3 = null;

  function prepInfo(
    thumb,
    thumbImg,
    thumbGlowImg,
    box,
    boxImg,
    boxTextHeader,
    boxTextPara,
    boxButton0,
    boxButton1,
    boxButton2,
    boxButton3
  ) {
    infoThumb = thumb;
    infoThumbImg = thumbImg;
    infoThumbGlowImg = thumbGlowImg;
    infoBox = box;
    infoBoxImg = boxImg;
    infoBoxTextHeader = boxTextHeader;
    infoBoxTextPara = boxTextPara;
    infoBoxButton0 = boxButton0;
    infoBoxButton1 = boxButton1;
    infoBoxButton2 = boxButton2;
    infoBoxButton3 = boxButton3;
  }

  function showInfoThumb(touchInput, desiredRadius, selectedLens = 1) {
    var offsetY = document.documentElement.clientHeight / 2;
    if (
      infoThumb !== null &&
      touchInput !== null &&
      touchInput.center.y > offsetY
    ) {
      infoThumb.style.display = "flex";
      infoThumb.style.width = infoThumbWidth + "px";
      infoThumb.style.height = infoThumbHeight + "px";
      infoThumb.style.top = touchInput.center.y - infoThumbHeight / 2 + "px";
      if (selectedLens == 2) {
        infoThumbImg.src = "images/dropdown/ic-logo-conv@3x.png";
        infoThumbGlowImg.src = "images/dropdown/ic-logo-conv@3x.png";
      } else {
        infoThumbImg.src = "images/seemax-ultimate-logo.png";
        infoThumbGlowImg.src = "images/seemax-ultimate-logo-glow.png";
      }
      if (touchInput.center.x >= document.documentElement.clientWidth / 2) {
        // display on left
        infoThumb.style.left =
          touchInput.center.x -
          desiredRadius -
          infoThumbWidth -
          infoThumbPadding +
          "px";
        infoThumb.style.borderTopLeftRadius = "20px";
        infoThumb.style.borderBottomLeftRadius = "20px";
        infoThumb.style.borderTopRightRadius = "0px";
        infoThumb.style.borderBottomRightRadius = "0px";
        infoThumb.style.justifyContent = "flex-start";
        infoThumbImg.style.marginLeft = "27px";
        infoThumbImg.style.marginRight = "0px";
        infoThumbImg.style.left = "0";
        infoThumbImg.style.right = "auto";
        infoThumbGlowImg.style.marginLeft = "27px";
        infoThumbGlowImg.style.marginRight = "0px";
        infoThumbGlowImg.style.left = "0";
        infoThumbGlowImg.style.right = "auto";
      } else {
        // display on right
        infoThumb.style.left =
          touchInput.center.x + desiredRadius + infoThumbPadding + "px";
        infoThumb.style.borderTopLeftRadius = "0px";
        infoThumb.style.borderBottomLeftRadius = "0px";
        infoThumb.style.borderTopRightRadius = "20px";
        infoThumb.style.borderBottomRightRadius = "20px";
        infoThumb.style.justifyContent = "flex-end";
        infoThumbImg.style.marginLeft = "0px";
        infoThumbImg.style.marginRight = "27px";
        infoThumbImg.style.left = "auto";
        infoThumbImg.style.right = "0";
        infoThumbGlowImg.style.marginLeft = "0px";
        infoThumbGlowImg.style.marginRight = "27px";
        infoThumbGlowImg.style.left = "auto";
        infoThumbGlowImg.style.right = "0";
      }
    } else {
      hideInfoThumb();
    }
  }

  function hideInfoThumb() {
    infoThumb.style.display = "none";
    infoThumb.style.width = "0px";
    infoThumb.style.height = "0px";
  }

  function moveInfoThumb(touchInput, desiredRadius) {
    if (infoThumb !== null && touchInput !== null) {
      infoThumb.style.top = touchInput.center.y - infoThumbHeight / 2 + "px";
      if (touchInput.center.x >= document.documentElement.clientWidth / 2) {
        // display on left
        infoThumb.style.left =
          touchInput.center.x -
          desiredRadius -
          infoThumbWidth -
          infoThumbPadding +
          "px";
        infoThumb.style.borderTopLeftRadius = "20px";
        infoThumb.style.borderBottomLeftRadius = "20px";
        infoThumb.style.borderTopRightRadius = "0px";
        infoThumb.style.borderBottomRightRadius = "0px";
        infoThumb.style.justifyContent = "flex-start";
        infoThumbImg.style.marginLeft = "27px";
        infoThumbImg.style.marginRight = "0px";
        infoThumbImg.style.left = "0";
        infoThumbImg.style.right = "auto";
        infoThumbGlowImg.style.marginLeft = "27px";
        infoThumbGlowImg.style.marginRight = "0px";
        infoThumbGlowImg.style.left = "0";
        infoThumbGlowImg.style.right = "auto";
      } else {
        // display on right
        infoThumb.style.left =
          touchInput.center.x + desiredRadius + infoThumbPadding + "px";
        infoThumb.style.borderTopLeftRadius = "0px";
        infoThumb.style.borderBottomLeftRadius = "0px";
        infoThumb.style.borderTopRightRadius = "20px";
        infoThumb.style.borderBottomRightRadius = "20px";
        infoThumb.style.justifyContent = "flex-end";
        infoThumbImg.style.marginLeft = "0px";
        infoThumbImg.style.marginRight = "27px";
        infoThumbImg.style.left = "auto";
        infoThumbImg.style.right = "0";
        infoThumbGlowImg.style.marginLeft = "0px";
        infoThumbGlowImg.style.marginRight = "27px";
        infoThumbGlowImg.style.left = "auto";
        infoThumbGlowImg.style.right = "0";
      }
    }
  }

  function showInfoBox(touchInput, desiredRadius) {
    if (infoBox !== null && touchInput !== null) {
      infoBox.style.display = "flex";
      infoBox.style.width = infoBoxWidth + "px";
      infoBox.style.height = infoBoxHeight + "px";
      infoBox.style.top = touchInput.center.y - infoBoxHeight / 2 + "px";
      if (touchInput.center.x >= document.documentElement.clientWidth / 2) {
        // display on left
        infoBox.style.left =
          touchInput.center.x -
          desiredRadius -
          infoBoxWidth -
          infoBoxPadding +
          "px";
      } else {
        // display on right
        infoBox.style.left =
          touchInput.center.x + desiredRadius + infoBoxPadding + "px";
      }
    }
  }

  function hideInfoBox() {
    infoBox.style.display = "none";
    infoBox.style.width = "0px";
    infoBox.style.height = "0px;";
  }

  function moveInfoBox(touchInput, desiredRadius) {
    if (infoBox !== null && touchInput !== null) {
      infoBox.style.top = touchInput.center.y - infoBoxHeight / 2 + "px";
      if (touchInput.center.x >= document.documentElement.clientWidth / 2) {
        // display on left
        infoBox.style.left =
          touchInput.center.x -
          desiredRadius -
          infoBoxWidth -
          infoBoxPadding +
          "px";
      } else {
        // display on right
        infoBox.style.left =
          touchInput.center.x + desiredRadius + infoBoxPadding + "px";
      }
    }
  }

  function updateInfo(buttonId) {
    var index = parseInt(buttonId.slice(-1));
    infoBoxImg.src = selectedInfo[index].img;
    infoBoxTextHeader.firstElementChild.textContent =
      selectedInfo[index].header;
    infoBoxTextPara.firstElementChild.textContent = selectedInfo[index].para;
  }

  function updateEffect(effectId) {
    if (effectId === null || effectId == "") {
      return;
    }
    var index = parseInt(effectId.slice(-1));
    selectedInfo = info[index];
    switch (selectedInfo.length) {
      case 1: {
        infoBoxButton0.style.display = "none";
        infoBoxButton1.style.display = "none";
        infoBoxButton2.style.display = "none";
        infoBoxButton3.style.display = "none";
        infoBoxButton0.style.borderBottomRightRadius = "10px";
        infoBoxButton1.style.borderBottomRightRadius = "0px";
        infoBoxButton2.style.borderBottomRightRadius = "0px";
        infoBoxButton3.style.borderBottomRightRadius = "0px";
        break;
      }
      case 2: {
        infoBoxButton0.style.display = "block";
        infoBoxButton1.style.display = "block";
        infoBoxButton2.style.display = "none";
        infoBoxButton3.style.display = "none";
        infoBoxButton0.style.borderBottomRightRadius = "0px";
        infoBoxButton1.style.borderBottomRightRadius = "10px";
        infoBoxButton2.style.borderBottomRightRadius = "0px";
        infoBoxButton3.style.borderBottomRightRadius = "0px";
        break;
      }
      case 3: {
        infoBoxButton0.style.display = "block";
        infoBoxButton1.style.display = "block";
        infoBoxButton2.style.display = "block";
        infoBoxButton3.style.display = "none";
        infoBoxButton0.style.borderBottomRightRadius = "0px";
        infoBoxButton1.style.borderBottomRightRadius = "0px";
        infoBoxButton2.style.borderBottomRightRadius = "10px";
        infoBoxButton3.style.borderBottomRightRadius = "0px";
        break;
      }
      case 4: {
        infoBoxButton0.style.display = "block";
        infoBoxButton1.style.display = "block";
        infoBoxButton2.style.display = "block";
        infoBoxButton3.style.display = "block";
        infoBoxButton0.style.borderBottomRightRadius = "0px";
        infoBoxButton1.style.borderBottomRightRadius = "0px";
        infoBoxButton2.style.borderBottomRightRadius = "0px";
        infoBoxButton3.style.borderBottomRightRadius = "10px";
        break;
      }
    }
  }

  return {
    prepInfo: prepInfo,
    showInfoThumb: showInfoThumb,
    hideInfoThumb: hideInfoThumb,
    moveInfoThumb: moveInfoThumb,
    showInfoBox: showInfoBox,
    hideInfoBox: hideInfoBox,
    moveInfoBox: moveInfoBox,
    updateInfo: updateInfo,
    updateEffect: updateEffect,
  };
})();

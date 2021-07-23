var isDebugging = true;

var touch = (function() {

  var touchInput;
  var desiredRadius;
  var noOfLegs

  function prepTouch(r, l) {
    desiredRadius = r;
    noOfLegs = l;
  }

  function setTouchInput(input) {
    touchInput = input;
  }

  function getTouchInput() {
    return touchInput;
  }

  function distanceSquareBetween2Points(a, b) {
    return Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2);
  }

  function distanceBetween2Points(a, b) {
    return Math.sqrt(distanceSquareBetween2Points(a, b));
  }

  function sortArrayByDistanceFromReference(ref, array) {
    var arr = array.sort(function(a, b) {  
      return distanceSquareBetween2Points(ref, a) - distanceSquareBetween2Points(ref, b)
    });
    return arr;
  }

  function getLengthOfEquilateralTriangle(radius, noOfSides) {
    return length = 2 * (radius * Math.sin(Math.PI / noOfSides))
  }

  function getTouchesEquallySpacedApart(touches) {
    if (touches && touches.length > 1) {
      if (touches.length > 2) {
        for (var i = 0; i < touches.length; i++) {
          var ref = {x: touches[i].clientX, y: touches[i].clientY};
          var array = touches.filter( function(x, index) {
            return index != i
          }).map( function(e) {
            return ({x: e.clientX, y: e.clientY})
          });
          var sortedArray = sortArrayByDistanceFromReference(ref, array);
          var length = getLengthOfEquilateralTriangle(desiredRadius, noOfLegs);
          var dist1 = distanceBetween2Points(ref, sortedArray[0])
          var dist2 = distanceBetween2Points(ref, sortedArray[1])
          if (Math.abs(dist1 + dist2 -  2 * length) < length * 0.05) {
            return [{clientX: ref.x, clientY: ref.y}, {clientX: sortedArray[0].x, clientY: sortedArray[0].y}, {clientX: sortedArray[1].x, clientY: sortedArray[1].y}];
          }
        }
        return null 
      } else {
        return touches
      }
    }
    return null;
  }

  function isTouchWithinDistanceOfCenter(touch, center, distance) {

    // var distanceBetweenCenter = distanceBetween2Points({x: center.x, y: center.y}, {x: touch.clientX, y: touch.clientY});
    // return distanceBetweenCenter <= distance * 1.05 && distanceBetweenCenter >= distance * 0.95;

    return true;
  }

  // pentagon properties (five sided polygon)
  // side = 1.176 * radius
  // width = 1.168 * side
  // distance between two farthest separated points, which equals the diagonal length

  function isValidTouch(touch) {
    if (touchInput) {
      var bool = isTouchWithinDistanceOfCenter(touch, touchInput.center, desiredRadius);
      return bool
    }
    return true;
  }

  function getValidTouches(targetTouches) {
    var validTouches = []
    if (touchInput) {
      for (i = 0; i < targetTouches.length; i++) {
        if (isValidTouch(targetTouches[i], touchInput.center)) {
          validTouches.push(targetTouches[i]);
        }
      }
    } else {
      var input = getCenterWithTouches(targetTouches)
      if (input) {
        for (i = 0; i < targetTouches.length; i++) {
          if (isTouchWithinDistanceOfCenter(targetTouches[i], input.center, desiredRadius)) {
            validTouches.push(targetTouches[i]);
          }
        }
      }
    }
    return validTouches;
  }

  function getGesturePosition(event) {
    if (event.targetTouches) {
      var validTouches = getValidTouches(event.targetTouches);
      // if (validTouches.length > 1) {
      //   var equallyDistanceTouches = getTouchesEquallySpacedApart(validTouches);

      //   if (equallyDistanceTouches) {
          var input = getCenterWithTouches(validTouches);
          // var input = getCenterWithTouches(equallyDistanceTouches);
      //     if (input) {
            setTouchInput(input);
            return true;
      //     }
      //   } 
      // }
    }

    setTouchInput(null);
    return false;
  }

  function getCenterWithTouches(touches) {
    if(isDebugging){
      return {
        center: {
          x: touches[0].clientX,
          y: touches[0].clientY
        },
        radius: desiredRadius
      };
    }

    if (touches.length == 2) {
      return getCentersWith2TouchesAndRadius(touches);
    } else if (touches.length == 3) {
      return getCenterAndRadiusWith3Touches(touches);
    } else if (touches.length > 3) {
      return getCenterAndRadiusWithMoreThan3Touches(touches);
    }
    return null
  }

  function getCenterAndRadiusWithMoreThan3Touches(targetTouches) {
    if (targetTouches.length > 3) {
      // var keys = [...Array(targetTouches.length).keys()]
      var keys = Array.from(Array(targetTouches.length).keys());
      var i = 0;
      
      var randomKeys = _.sample(keys, 3);
      var shuffledTouches = [targetTouches[randomKeys[0]], targetTouches[randomKeys[1]], targetTouches[randomKeys[2]]]
      var selectedTouchInput = getCenterAndRadiusWith3Touches(shuffledTouches);
      return selectedTouchInput;
    }
    return null;
  }

  function getCenterAndRadiusWith3Touches(touches) {
    var a = touches[0];
    var b = touches[1];
    var c = touches[2];
    var d1 = {};
    d1.x = b.clientY - a.clientY;
    d1.y = a.clientX - b.clientX;
    var d2 = {};
    d2.x = c.clientY - a.clientY;
    d2.y = a.clientX - c.clientX;
    var k = (d2.x * d1.y) - (d2.y * d1.x);
    
    if (k >= -0.00001 && k <= 0.00001) return {
      center: null,
      radius: null
    }

    var s1 = {};
    s1.x = (a.clientX + b.clientX) / 2.0;
    s1.y = (a.clientY + b.clientY) / 2.0;
    var s2 = {};
    s2.x = (a.clientX + c.clientX) / 2.0;
    s2.y = (a.clientY + c.clientY) / 2.0;
    var l = d1.x * (s2.y - s1.y) - d1.y * (s2.x - s1.x);
    var m = l / k
    var center = {};
    center.x = s2.x + (m * d2.x);
    center.y = s2.y + (m * d2.y);
    var dx = center.x - a.clientX;
    var dy = center.y - a.clientY;
    var radius = Math.sqrt((dx * dx) + (dy * dy));
    return {
      center: center,
      radius: radius
    }
  }

  function getCentersWith2TouchesAndRadius(targetTouches) {
    if (touchInput && targetTouches.length === 2 ) {
      var a = targetTouches[0];
      var b = targetTouches[1];
      var q1 = Math.pow(a.clientX - b.clientX, 2);
      var q2 = Math.pow(a.clientY - b.clientY, 2);
      var q = Math.sqrt(q1 + q2);
      var x3 = (a.clientX + b.clientX) / 2.0;
      var y3 = (a.clientY + b.clientY) / 2.0;
      var baseX = Math.sqrt(Math.pow(touchInput.radius, 2) - Math.pow(q/2.0, 2)) * (b.clientY - a.clientY) / q
      var baseY = Math.sqrt(Math.pow(touchInput.radius, 2) - Math.pow(q/2.0, 2)) * (a.clientX - b.clientX) / q

      var center1 = {
        x: x3 + baseX,
        y: y3 + baseY
      };

      var center2 = {
        x: x3 - baseX,
        y: y3 - baseY
      }

      var currentCenter = touchInput.center;

      distance1BetweenCurrentCenter = Math.sqrt( Math.pow((currentCenter.x - center1.x), 2) + Math.pow((currentCenter.y - center1.y), 2));
      distance2BetweenCurrentCenter = Math.sqrt( Math.pow((currentCenter.x - center2.x), 2) + Math.pow((currentCenter.y - center2.y), 2));
      if (distance1BetweenCurrentCenter <= distance2BetweenCurrentCenter) {
        return {
          center: center1,
          radius: touchInput.radius
        }
      } else {
        return {
          center: center2,
          radius: touchInput.radius
        }
      }
    }
    return null
  }

  return {
    prepTouch: prepTouch,
    setTouchInput: setTouchInput,
    getTouchInput: getTouchInput,
    isTouchWithinDistanceOfCenter: isTouchWithinDistanceOfCenter,
    isValidTouch: isValidTouch,
    getValidTouches: getValidTouches,
    getGesturePosition: getGesturePosition,
    getCenterWithTouches: getCenterWithTouches,
    getCenterAndRadiusWith3Touches: getCenterAndRadiusWith3Touches,
    getCentersWith2TouchesAndRadius: getCentersWith2TouchesAndRadius,
    getCenterAndRadiusWithMoreThan3Touches: getCenterAndRadiusWithMoreThan3Touches
  }
}());
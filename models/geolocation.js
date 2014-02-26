
var toRad = function (value) {
    'use strict';
    return value * Math.PI / 180;
  };

var getDistance = function (b1, l1, b2, l2) {
    'use strict';

    var e, result;

    b1 = b1 / 180 * Math.PI;
    l1 = l1 / 180 * Math.PI;
    b2 = b2 / 180 * Math.PI;
    l2 = l2 / 180 * Math.PI;

    e = Math.atan(Math.sin(b1) * Math.sin(b2) + Math.cos(b1) * Math.cos(b2) * Math.cos(l2 - l1));
    result = e * 6378.137;

    return result;
  };
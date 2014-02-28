
/*global localStorage, $ */

var saveHistory = function (line) {
    'use strict';
    var i;

    if (localStorage.length > 10) {
      for (i = 1; i < 11; i += 1) {
        localStorage.setItem(i, '');
      }
    }
    for (i = 10; i > 1; i -= 1) {
      localStorage.setItem(i, localStorage.getItem(i - 1));
    }
    localStorage.setItem(1, line);
  };

var getHistory = function () {
    'use strict';
    var i, item;

    for (i = 10; i > 0; i -= 1) {
      item = localStorage.getItem(i);
      if (item !== 'null') {
        $('#msgs').append(item);
      }
    }
  };
/*global $, io, saveHistory, getHistory, getDistance, userName */

var socket = io.connect('http://localhost:8080');

$('#sendBtn').on('click', function (e) {
    'use strict';

    var msg = $('#msg').val();

    e.preventDefault();

    socket.emit('msg', '{"msg": "' + msg + '"}');
    $('#msg').val('');
  });

socket.on('msg', function (msg) {
    'use strict';

    var now, hours, minutes, time, data;

    now = new Date();
    hours = now.getHours();
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = now.getMinutes();
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    time = hours + ':' + minutes;

    data = JSON.parse(msg);

    msg = '<div>' + time + ' - <b>' + data.name + '</b>: ' + data.msg + '</div>';

    saveHistory(msg);

    $('#msgs').append($(msg));
  });

socket.on('join', function (msg) {
    'use strict';

    var data, names, myPos, pos, distance, user, i;

    data = JSON.parse(msg);
    $('#users').empty();

    names = Object.keys(data.users);

    myPos = data.users[userName];
    myPos = {'lat': 48.3548753, 'long': 11.7920352};

    for (i = 0; i < names.length; i += 1) {

      pos = data.users[names[i]];
      distance = getDistance(pos.lat, pos.long, myPos.lat, myPos.long);

      user = $('<div>' + names[i] + ' (' + distance + ')</div>');
      $('#users').append(user);
    }
  });

socket.on('connect', function () {
    var geolocation = navigator.geolocation;

    geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;

        var data = {
            name: userName,
            position: {
                "lat": lat,
                "long": long
            }
        }

        var data = JSON.stringify(data);
        getHistory();
        socket.emit("join", data);
    });
});

socket.on('connect', function () {
    'use strict';

    var data = {
        name: userName,
        position: {
            'lat': 52.525191,
            'long': 13.413883
          }
        };

    data = JSON.stringify(data);
    getHistory();
    socket.emit('join', data);
  });
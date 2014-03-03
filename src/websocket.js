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

    msg = '<div class="usermessage">' + time + ' - <b>' + data.name + '</b>: ' + data.msg + '</div>';

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

    for (i = 0; i < names.length; i += 1) {

        pos      = data.users[names[i]];
        distance = getDistance(pos.lat, pos.long, myPos.lat, myPos.long);

        user = $('<div class="username">' + names[i] + ' (' + Math.round(distance * 1000) / 1000 + ' km)</div>');
        $('#users').append(user);
    }
});

socket.on('connect', function () {
    'use strict';

    var geolocation = navigator.geolocation;

    if (navigator.onLine) {
        geolocation.getCurrentPosition(function (pos) {
            var data = {
                name: userName,
                position: {
                    'lat': pos.coords.latitude,
                    'long': pos.coords.longitude
                }
            };

            data = JSON.stringify(data);
            getHistory();
            socket.emit('join', data);
        });
    }
});


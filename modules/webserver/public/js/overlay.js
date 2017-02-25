var socket = io(document.location.origin+'/overlay');

socket.on('joined', function(data){
    console.log("socket.io - joined " + data);
});

socket.on('connect', function() {
    console.log("socket.io - connected");
    socket.emit('join', { room: room, key: key });
});

function roomUnavailable() {
    $('#room-unavailable').fadeIn();
}

socket.on('disconnect', roomUnavailable);
socket.on('error', roomUnavailable);
socket.on('room-unavailable', roomUnavailable);
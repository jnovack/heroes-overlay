var socket = io(document.location.origin+'/overlay');

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('joined', function(data){
    console.log("socket.io - joined " + data);
});

socket.on('connect', function() {
    console.log("socket.io - connected");
    socket.emit('join', { room: room, key: key });
});
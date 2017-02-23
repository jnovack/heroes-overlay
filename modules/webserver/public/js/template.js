var socket = io(document.location.origin+'/template');

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('joined', function(data){
    console.log("socket.io - joined " + data);
});

socket.on('connect', function() {
    console.log("socket.io - connected");
    socket.emit('join', 'template');
});

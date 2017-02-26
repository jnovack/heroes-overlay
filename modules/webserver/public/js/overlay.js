var socket = io(document.location.origin+'/overlay');

socket.on('joined', function(data){
    console.log("socket.io - joined " + data);
});

socket.on('connect', function() {
    console.log("socket.io - connected");
    socket.emit('join', { room: room, key: key });
});

function roomUnavailable() {
    $('#alert-room').fadeIn();
    $('#alert-link').fadeOut();
}

socket.on('disconnect', roomUnavailable);
socket.on('error', roomUnavailable);
socket.on('room-unavailable', roomUnavailable);

$(document).ready(function(){
	// Initialize content
	initContent();
	function initContent(){
	    $('.numRounds').hide();
	};
});
socket.on('setting', function(data) {
    console.log(data);

    if ($("#"+data.id).text() != data.text) {

        if ($("#"+data.id).hasClass("text")) {
            $("#"+data.id).text(data.text);
        }

        if ($("#"+data.id).hasClass("value")) {
            $("#"+data.id).text(data.text);
        }

        // Trigger a change based off the changed data
	    $("#"+data.id).trigger('changeData');
    }
});


socket.on('command', function(data){
	switch (data.action) {
		case "reload":
		    console.log("reloading...");
		    location.reload();
		    break;
		case "hide":
			console.log("hiding overlay...");
			$('#content').hide();
		    break;
		case "show":
			console.log("showing overlay...");
			$('#content').show();
		    break;
		case "draft":
			console.log("setting 'draft' mode...");
			$('.mode').removeClass('game').addClass('draft');
			break;
		case "game":
			console.log("setting 'game' mode...");
			$('.mode').removeClass('draft').addClass('game');
			break;
        case "chroma-off":
            console.log("setting 'chroma' mode to 'off'...");
            $('#wide-screen').removeClass('chromakey').addClass('transparent');
            break;
        case "chroma-on":
            console.log("setting 'chroma' mode to 'on'...");
            $('#wide-screen').removeClass('transparent').addClass('chromakey');
            break;
	}
});

$('#containerBackground').bind('changeData', function(e){
    $('#wide-screen').removeClass().addClass($('#containerBackground').text());
});

$('#blueWins').bind('changeData', function(e){
    $('.blueWins').css({ fill: "#6666FF" });
    $('.blueWins' + $('#blueWins').text()).css({ fill: "#FFFFFF" });
});

$('#redWins').bind('changeData', function(e){
    $('.redWins').css({ fill: "#FF6666" });
    $('.redWins' + $('#redWins').text()).css({ fill: "#FFFFFF" });
});


$('#numRounds').bind('changeData', function(e){
    $('.numRounds').hide();
    $('.numRounds' + $('#numRounds').text()).show();
});

$(document).ready(function(){
	// Initialize content
	initContent();
	function initContent(){
	    $('html, body').css('cursor','none');
	};
});
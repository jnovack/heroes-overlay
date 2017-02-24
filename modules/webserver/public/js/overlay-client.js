socket.on('setting', function(data) {
    console.log(data);

    if ($("#"+data.id).text() != data.text) {

        if ($("#"+data.id).hasClass("text")) {
            $("#"+data.id).text(data.text);
        }
    }
});

$(document).ready(function(){

// Initialize content
initContent();
    function initContent(){
        $('html, body').css('cursor','none');
    };
});
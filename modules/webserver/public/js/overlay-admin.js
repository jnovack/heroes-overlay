socket.on('connect', function() {
    socket.emit('join', { room: 'overlay:'+opt_id, admin: true });
});

function send(message) {
    socket.emit('broadcast', message);
    console.log(message);
}


/*
 ***** Master Buttons *****
 */

$("#reloadButton").click(function() {
    send({ event: 'command', data: { action: 'reload' }});
});

$("#swapButton").click(function() {
    var blue = $('#blueteamname').val();
    var red = $('#redteamname').val();
    send({ event: 'setting', data: { id: 'blueteamname', text: red } });
    send({ event: 'setting', data: { id: 'redteamname', text: blue } });
});


/*
 ****** Inputs *****
 */

$("input[data-group='text']").blur(function() {
    result = $(this).val();
    pattern = new RegExp(/[a-zA-Z0-9 \'\"\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\;\:\,\.]/);
    if (pattern.test(result) || result == "") {
        message = { event: 'setting', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
    }
});


/*
 ***** Receiving *****
 */
 socket.on('setting', function(data) {
    console.log(data);

    // Admin helper functions
    if (typeof $('#'+data.id).prop('type') !== "undefined") {
        switch ($('#'+data.id).prop('type')) {
            case "text":
                $("#"+data.id).val(data.text);
                break;
            case "textarea":
                $("#"+data.id).html(data.text);
                break;
            case "select-one":
                    $('#'+data.id + ' option[value=' + data.text + ']').prop('selected', true);
                break;
            default:
                console.log($('#'+data.id).prop('type'));
        }
    }

});
function send(message) {
    socket.emit('broadcast', message);
    console.log(message);
}

/*
 ***** Master Buttons *****
 */

$("#containerBackground").on('changed.bs.select', function(e) {
    send({ event: 'setting', data: { id: 'containerBackground', text: e.target.value } });
});


$("#reloadButton").click(function() {
    send({ event: 'command', data: { action: 'reload' }});
});

$("#draftButton").click(function() {
    if ($('#draftButton').hasClass('active')) {
        $('#draftButton').removeClass('btn-info');
        $('#draftButtonIcon').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        send({ event: 'command', data: { action: 'game' }});
    } else {
        $('#draftButton').addClass('btn-info');
        $('#draftButtonIcon').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        send({ event: 'command', data: { action: 'draft' }});
    }
    $(document.activeElement).blur();
});


$("#visibilityButton").click(function() {
    if ($('#visibilityButton').hasClass('active')) {
        $('#visibilityButton').removeClass('btn-warning');
        $('#visibilityButtonIcon').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        send({ event: 'command', data: { action: 'hide' }});
    } else {
        $('#visibilityButton').addClass('btn-warning');
        $('#visibilityButtonIcon').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        send({ event: 'command', data: { action: 'show' }});
    }
    $(document.activeElement).blur();
});

$("#resetButton").click(function() {
    send({ event: 'setting', data: { id: 'blueteamname', text: "Potatoes" } });
    send({ event: 'setting', data: { id: 'redteamname', text: "Derpies" } });

    $('.selectpicker').selectpicker('val', '0');
    send({ event: 'setting', data: { id: 'numRounds', text: 0 } });

    $('.numRounds').hide();
    send({ event: 'setting', data: { id: 'blueWins', text: 0 } });
    send({ event: 'setting', data: { id: 'redWins', text: 0 } });

    $('#containerBackground').selectpicker('val', 'transparent');
    $(document.activeElement).blur();
});

$("#swapButton").click(function() {
    var blue = $('#blueteamname').val();
    var red = $('#redteamname').val();
    send({ event: 'setting', data: { id: 'blueteamname', text: red } });
    send({ event: 'setting', data: { id: 'redteamname', text: blue } });
    $(document.activeElement).blur();
});

$("#blueWins").on('changed.bs.select', function(e) {
    send({ event: 'setting', data: { id: 'blueWins', text: e.target.value } });
});

$("#redWins").on('changed.bs.select', function(e) {
    send({ event: 'setting', data: { id: 'redWins', text: e.target.value } });
});

$("#numRounds").on('changed.bs.select', function(e) {
    $('.numRounds').hide();
    $('.numRounds' + e.target.value).show();
    send({ event: 'setting', data: { id: 'numRounds', text: e.target.value } });
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
 // TODO - Not receiving properly.
socket.on('setting', function(data) {
    console.log(data);

    // Admin helper functions
    if (typeof $('#'+data.id).prop('type') !== "undefined") {
        switch ($('#'+data.id).prop('type')) {
            case "text":
                $("#"+data.id).val(data.text);
                break;
            default:
                console.log($('#'+data.id).prop('type'));
        }
    }

});
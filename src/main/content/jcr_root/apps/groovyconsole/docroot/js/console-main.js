function initialize(path) {
    window.editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night");

    var GroovyMode = ace.require("ace/mode/groovy").Mode;
    editor.getSession().setMode(new GroovyMode());

    editor.renderer.setShowPrintMargin(false);

    $("#toolbar button:first").button({
        icons: {
            primary: "ui-icon-document"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-folder-open"
        },
        text: false
    }).next().button({
        icons: {
            primary: "ui-icon-play"
        },
        text: false
    });

    $('#tabs').tabs().tabs('select', 3);
    $('#editor').resizable({ 
        handles: 's',
        resize: function(event, ui) {
            editor.resize();
        }
    });

    $(window).resize(function() {
        editor.resize();
    });
    
    $('#run').click(function(event) {
        $('#output').text('');
        $('#result').text('');
        $('#stacktrace').text('');
        $('#result-time').text('');

        $.ajax({
            type: 'POST',
            url: path,
            data: {
                script: editor.getSession().getValue()
            },
            dataType: 'json',
            success: function(data) {
                var result = data.executionResult;
                var output = data.outputText;
                var stackTrace = data.stacktraceText;
                var runTime = data.runningTime ? data.runningTime : "";

                $('#result-time').text(runTime).fadeIn();

                if (output && output.length > 0) {
                    $('#tabs').tabs('select', 1);
                    $('#output').text(output).fadeIn();
                } else {
                    $('#output').fadeOut();
                }

                if (result && result.length > 0) {
                    $('#tabs').tabs('select', 0);
                    $('#result').text(result).fadeIn();
                } else {
                    $('#result').fadeOut();
                }

                if (stackTrace && stackTrace.length > 0) {
                    $('#tabs').tabs('select', 2);
                    $('#stacktrace').text(stackTrace).fadeIn();
                } else {
                    $('#stacktrace').fadeOut();
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Error interacting with the CQ5 server: ' + errorThrown);
            }
        });
    });

    $('#loadingDiv').hide().ajaxStart(function() {
        $(this).show();
    }).ajaxStop(function() {
        $(this).hide();
    });
}
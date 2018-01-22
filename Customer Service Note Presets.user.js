// ==UserScript==
// @name         Customer Service Note Presets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a form to the order editing page which leaves a pre-written note, but lets the user fill in the missing values.
// @author       You
// @match        https://moosejaw.info/MachII/EditOrderERP.aspx?OrderID=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var notes_box = $("#ctl00_cphMainContent_tcOrders_tpNotes_upOrderNotes");
    var notes_table = $("#ctl00_cphMainContent_tcOrders_tpNotes_dgOrderNotes");
    var note_text_area = $("#ctl00_cphMainContent_tcOrders_tpNotes_dgOrderNotes_ctl01_txtComment");
    var new_note_box = $(note_text_area).parent("");
    var add_comment_button = $("#ctl00_cphMainContent_tcOrders_tpNotes_dgOrderNotes_ctl01_btnSaveNew");

    // List of preset comments
    var contacted_us_from = '<span id="contacted_us_from">Contacted us from </span>';
    var auth = '<span id="auth">Provided auth code: </span>';
    var no_auth = '<span id="no_auth">Did not provide an auth code. </span>';

    var attachHeightHandler = function() {
        // Automatically increase the height of the comments note textarea to fit the content the user types into it.
        $('textarea').each(function () {
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;width:285px');
        }).on('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    };

    var setButtons = function() {

        var list_of_presets = [
            [
                'Called us from',
                '<input type="text" id="contacted_from" size=12/>'
            ],
            [
                'Chatted us from',
                '<input type="text" id="contacted_from" size=12/>'
            ],
            [
                'Provided auth code:',
                '<input type="text" id="provided_auth"/>'
            ],
            [
                'Did not provide auth code.',
                ''
            ]
        ];

        var renderAButton = function(list){
            note_text_area.hide();

        };

        var usePreSet = function(addition){
            var text = note_text_area.value();
            note_text_area.value(text + ' ' + addition);
            //new_note_box.prepend('<div ><input type="text" id="newfield">');
        };

        // Create the buttons which, when clicked, add text to the note textarea.
        notes_box.css("position", "relative");
        notes_box.append('<div id="presets" style="position: absolute; top: 0em; left: 800px;style="width: 10em" background-color: #aaa;"></div>');
        //buttons_box.append();
        var buttons_box = $('#presets');
        $.each(list_of_presets, function(index, value){
            var text = value[0];
            var id = text.toLowerCase().replace(/[\W]+/g, '_');
            var el = '#' + id;
            buttons_box.append('<button id="' + id + '" style="width: 9em; text-align: left" })>' + text + '</button>' + value[1] + '<br>');
            $(el).on('click', function(){
                var whole_note = note_text_area.val();
                whole_note = whole_note + text;
                $("#ctl00_cphMainContent_tcOrders_tpNotes_dgOrderNotes_ctl01_txtComment").val(whole_note);
            });
        });

    }; // End setButtons

    $(document).ready(function() {
        setButtons();
        attachHeightHandler();
    });

    window.setInterval(function(){
        if ( $('contacted_us_from') === null ) {
            setButtons();
        }
        //if (typeof ($('#ctl00_cphMainContent_tcOrders_tpNotes_dgOrderNotes_ctl01_txtComment').data('events').input) !== "object") {
        //    attachHeightHandler();
        //}
    }, 1000);

    // Create the whole form, but leave everything hidden when the page loads.
    //new_note_box.append('<form id="note_form" display="hidden"><></form>');

    //renderAButton();


})();
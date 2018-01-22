// ==UserScript==
// @name         Trim leading and trailing whitespace from paste
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trim leading and trailing whitespace from paste
// @author       Matt Arnold
// @match        https://moosejaw.info/MachII/POSv2/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var search = document.getElementById('ctl00_cphMainContent_txtQuickSearch');
        var cleanPaste;

        cleanPaste = function(e) {
            e.preventDefault();
            var pastedText = '';
            if (window.clipboardData && window.clipboardData.getData) { // IE
                pastedText = window.clipboardData.getData('Text');
            } else if (e.clipboardData && e.clipboardData.getData) {
                pastedText = e.clipboardData.getData('text/plain');
            }
            this.value = pastedText.replace(/^\s+|\s+$/g, '');
        };

        search.onpaste = cleanPaste;
        console.log('Trim leading and trailing whitespace from paste');
    });
})();
// ==UserScript==
// @name         Set transaction search settings on Cybersource
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set search settings
// @author       You
// @match        https://ebc.cybersource.com/ebc/transactionsearch/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('select[name=searchField] option:contains("Account Number")').attr('selected', 'selected');
        window.setTimeout(function() {
            document.TransactionSearchForm.searchType[0].checked = true;
            document.TransactionSearchForm.searchField.disabled = false;
            document.TransactionSearchForm.searchValue.disabled = false;
            document.TransactionSearchForm.searchApplication.disabled = true;
            document.TransactionSearchForm.searchReply.disabled = true;
            $('input[name=searchValue]').focus();
        }, 100);
    });
})();
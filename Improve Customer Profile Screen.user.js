// ==UserScript==
// @name         Improve Customer Profile Screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve Customer Profile Screen
// @author       Matt Arnold
// @match        https://moosejaw.info/MachII/Customers/CustomerProfile.aspx?TWCustomerID=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(".OrdersLink").click();
    document.title = $("#ctl00_cphMainContent_txtBillingFirstName").val() + " " + $("#ctl00_cphMainContent_txtBillingLastName").val() + " " + $("#ctl00_cphMainContent_txtBillingEmail").val();

})();
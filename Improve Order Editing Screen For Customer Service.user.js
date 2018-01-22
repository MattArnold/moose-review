// ==UserScript==
// @name         Improve Order Editing Screen For Customer Service
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve Order Editing Screen For Customer Service
// @author       Matt Arnold
// @match        https://moosejaw.info/MachII/EditOrderERP.aspx?OrderID=*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {

        var email_box, bill_phone_box, ship_phone_box;
        var order_number, email, email_domain, bill_phone, ship_phone;
        var pay_methods, credit_card, auth_code, chk_select_all, select_status, notes_tab, invoices_tab, payments_tab, risk_tab, number_of_invoices, returns_tab, number_of_returns, tax_tab, promo_tab, info_tab;
        var number_of_products = 0;
        var pay_methods_list = [];
        var safe, maybe, warning;
        safe = {'background-color': '#c1ffdf', 'border-color': '#00b256'};
        warning = {'background-color': '#faffba', 'border-color': '#b8bc7a'};
        maybe = {'background-color': '#ffbea0', 'border-color': '#ff5000'};

        // Collect all the data we need from the page.
        order_number = $('#ctl00_cphMainContent_lblEcomOrderNumberOut').text();
        email_box = $('#ctl00_cphMainContent_lblCustomerEmailOut');
        email = email_box.text();
        email_domain = email.split('@')[1].split('.')[0];
        bill_phone_box = $('#ctl00_cphMainContent_lblBillPhoneOut');
        bill_phone = bill_phone_box.text();
        ship_phone_box = $('#ctl00_cphMainContent_lblPhoneNumberOut');
        ship_phone = ship_phone_box.text();
        pay_methods = $('table#ctl00_cphMainContent_tcOrders_tbPaymentInfo_dgPaymentInfo tbody tr td:nth-child(2)').map(function () {
            return this.innerText;
        }).get();
        auth_code = $('table#ctl00_cphMainContent_tcOrders_tbPaymentInfo_dgPaymentInfo tbody tr td:nth-child(8)').map(function () {
            if ( /[A-Z0-9]{6}/.test(this.innerText) ) {
                return this.innerText;
            }
        }).get();
        chk_select_all = $("#ctl00_cphMainContent_gvOrderDetails_ctl01_chkSelectAll");
        select_status = $("#ctl00_cphMainContent_ddlODStatus");
        notes_tab = $('#__tab_ctl00_cphMainContent_tcOrders_tpNotes');
        returns_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tpReturns");
        number_of_returns = 0;
        invoices_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tpInvoices");
        number_of_invoices = 0;
        payments_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tbPaymentInfo");
        tax_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tbTaxInfo");
        promo_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tbPromotionInfo");
        info_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tpOtherInfo");
        risk_tab = $("#__tab_ctl00_cphMainContent_tcOrders_tbReviewStatus");

        // Display info on the browser window's tab
        document.title = order_number;

        // Flag emails if they are Walmart or Jet
        if (email_domain === 'outlook') {
            email_box.css(maybe);
        } else if (email_domain.toUpperCase().indexOf('WALMART') !== -1 || email_domain.toUpperCase() === 'JET') {
            email_box.css(safe);
        }

        // Add dashes to the phone numbers
        function addDashes(num, box) {
            if (num) {
                num = num.slice(-10,-7) + "-" + num.slice(-7,-4) + "-" + num.slice(-4);
                box.text(num);
            }
        }
        addDashes(bill_phone, bill_phone_box);
        addDashes(ship_phone, ship_phone_box);

        // Check order status. Also count the number of line items to use in the next bit of code.
        $("table#ctl00_cphMainContent_gvOrderDetails tbody tr td table.DGItem tbody tr:nth-child(1):not(.DGHeader) td:nth-child(10)").each(function () {
            var status = $(this).text();
            if (status == "Shipped" || status == "DROPSHIP" || status == "Auto-Filled from Internet") {
                $(this).css(warning);
            } else if (status == "WAITING" || status == "WTV" || status == "ITV" || status == "Reprocess Flagged Order") {
                $(this).css(maybe);
            }
            number_of_products++;
        });

        // When user adds a status, and there is only one product,
        // it is a waste of time to pop up an alert asking them to select some products.
        // Therefore, check the "check all" checkbox (if it is not already checked).
        if (number_of_products == 1) {
            number_of_products++;
            select_status.on('change', function() {
                if (chk_select_all.prop('checked') ===  false) {
                    chk_select_all.trigger("click");
                }
            });
        }

        // Display how many returns there are
        $('table#ctl00_cphMainContent_tcOrders_tpReturns_dgReturns tbody tr td:nth-child(1)').map(function() {
            if (this.innerText.indexOf('Return Label Printed') != -1) {
                number_of_returns++;
            }
        });
        returns_tab.prepend(number_of_returns + ' ');

        // Display how many invoices there are
        $('table#ctl00_cphMainContent_tcOrders_tpInvoices_dgInvoices tbody tr td:nth-child(1)').map(function() {
            if (/\d{8}x\d{9}/.test(this.innerText)) {
                number_of_invoices++;
            }
        });
        invoices_tab.prepend(number_of_invoices + ' ');

        // Display payment methods
        credit_card = false;
        for (var j = 1; j < pay_methods.length; j++){
            var separator = (j === 1) ? '' : ', ';
            if (pay_methods[j] === 'Credit Card') {
                credit_card = true;
                pay_methods[j] = 'Credit';
            } else if (pay_methods[j] === 'Reward Points') {
                pay_methods[j] = 'Points';
            }
            if (pay_methods[j] !== '\xa0') {
                pay_methods_list = pay_methods_list + separator + pay_methods[j];
            }
        }
        if (pay_methods.length === 0) {
            payments_tab.text('No payments.');
            payments_tab.css(warning);
        } else {
            payments_tab.text("Paid with " + pay_methods_list);
            payments_tab.css('text-align', '-webkit-left');
        }
        if (!credit_card) {
            payments_tab.css(warning);
        }

        // Display auth code
        if (auth_code.length) {
            payments_tab.append('. Auth: ' + auth_code[0]);
        }

        // Shorten title on several tabs to make it less likely to line-wrap the tabs
        notes_tab.text("Notes");
        tax_tab.text("Tax");
        promo_tab.text("Promos");
        info_tab.text("Add'l Info");
        risk_tab.text("Risk");

    }); // End documentready function

})();

// ==UserScript==
// @name         ERP page: Highlight order info for review team
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight order info for review team
// @author       Matt
// @include      https://moosejaw.info/MachII/EditOrderERP.aspx?OrderID=*
// @match        https://moosejaw.info/MachII/EditOrderERP.aspx?OrderID=*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    var improveOrderScreen = function() {
        console.log('reached improveOrderScreen');

        var total_box, bill_state_box, ship_state_box, ship_method_box, bill_country_box, bill_first_name_box, ship_first_name_box, bill_last_name_box, ship_last_name_box, bill_address_one_box, ship_address_one_box, bill_address_two_box, ship_address_two_box, bill_city_box, ship_city_box, email_box, bill_phone_box, ship_phone_box;
        var order_number, total, bill_state, ship_state, ship_method, bill_country, bill_first_name, ship_first_name, bill_last_name, ship_last_name, name, bill_address_one, ship_address_one, bill_address_two, ship_address_two, bill_city, ship_city, email, emaillocal, email_domain, bill_phone, ship_phone;
        var main_table, ip, bin, bin_url, pay_methods, credit_card, auth_code, signifyd, notes_tab, invoices_tab, payments_tab, risk_tab, number_of_invoices, returns_tab, number_of_returns, tax_tab, promo_tab, info_tab, signifyd_link, chk_select_all, select_status, nodeAdded;
        var number_of_products = 0;
        var pay_methods_list = [];
        var safe, maybe, warning;
        safe = {'background-color': '#c1ffdf', 'border-color': '#00b256'};
        warning = {'background-color': '#faffba', 'border-color': '#b8bc7a'};
        maybe = {'background-color': '#ffbea0', 'border-color': '#ff5000'};

        // Collect all the data we need from the page.
        order_number = $('#ctl00_cphMainContent_lblEcomOrderNumberOut').text();
        total_box = $("#ctl00_cphMainContent_lblOrderTotalOut");
        total = total_box.text();
        bill_state_box = $("#ctl00_cphMainContent_lblBillStateOut");
        bill_state = bill_state_box.text();
        ship_state_box = $("#ctl00_cphMainContent_txtShipState");
        ship_state = ship_state_box.val();
        ship_method_box = $("#ctl00_cphMainContent_lblOriginalShipMethodOut");
        ship_method = ship_method_box.text();
        bill_country_box = $("#ctl00_cphMainContent_lblBillCountryOut");
        bill_country = bill_country_box.text();
        main_table = $(".editOrderTableStyles tr:last");
        ip = $("#ctl00_cphMainContent_tcOrders_tbReviewStatus_lblFormatRemoteIP").text();
        bin = $("#ctl00_cphMainContent_tcOrders_tbPaymentInfo_dgPaymentInfo .DGItem td:nth-child(4)").text();
        bill_first_name_box = $("#ctl00_cphMainContent_lblBillCustomerFirstOut");
        bill_first_name = bill_first_name_box.text();
        ship_first_name_box = $("#ctl00_cphMainContent_txtShipCustomerFirst");
        ship_first_name = ship_first_name_box.val();
        bill_last_name_box = $("#ctl00_cphMainContent_lblBillCustomerLastOut");
        bill_last_name = bill_last_name_box.text();
        ship_last_name_box = $("#ctl00_cphMainContent_txtShipCustomerLast");
        ship_last_name = ship_last_name_box.val();
        name = bill_first_name + ' ' + bill_last_name;
        bill_address_one_box = $("#ctl00_cphMainContent_lblBillAddress1Out");
        bill_address_one = bill_address_one_box.text().replace(/\./g,'');
        ship_address_one_box = $("#ctl00_cphMainContent_txtShipAddress1");
        ship_address_one = ship_address_one_box.val().replace(/\./g,'');
        bill_address_two_box  = $("#ctl00_cphMainContent_lblBillAddress2Out");
        bill_address_two = bill_address_two_box.text().replace(/\./g,'');
        ship_address_two_box  = $("#ctl00_cphMainContent_txtShipAddress2");
        ship_address_two = ship_address_two_box.val().replace(/\./g,'');
        bill_city_box = $("#ctl00_cphMainContent_lblBillCityOut");
        bill_city = bill_city_box.text();
        ship_city_box = $("#ctl00_cphMainContent_txtShipCity");
        ship_city = ship_city_box.val();
        email_box = $('#ctl00_cphMainContent_lblCustomerEmailOut');
        email = email_box.text();
        emaillocal = email.split('@')[0];
        email_domain = email.split('@')[1].split('.')[0];
        bill_phone_box = $('#ctl00_cphMainContent_lblBillPhoneOut');
        bill_phone = bill_phone_box.text();
        ship_phone_box = $('#ctl00_cphMainContent_lblPhoneNumberOut');
        ship_phone = ship_phone_box.text();
        chk_select_all = $("#ctl00_cphMainContent_gvOrderDetails_ctl01_chkSelectAll");
        select_status = $("#ctl00_cphMainContent_ddlODStatus");
        pay_methods = $('table#ctl00_cphMainContent_tcOrders_tbPaymentInfo_dgPaymentInfo tbody tr td:nth-child(2)').map(function () {
            return this.innerText;
        }).get();
        auth_code = $('table#ctl00_cphMainContent_tcOrders_tbPaymentInfo_dgPaymentInfo tbody tr td:nth-child(8)').map(function () {
            if ( /[A-Z0-9]{6}/.test(this.innerText) ) {
                return this.innerText;
            }
        }).get();
        signifyd = $('#ctl00_cphMainContent_tcOrders_tbReviewStatus_lblFormatStatus').text().replace('Signifyd: ', '');
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
        signifyd_link = $("#ctl00_cphMainContent_tcOrders_tbReviewStatus_hlReviewStatus");

        // Display info on the browser window's tab
        document.title = order_number + ' ' + name + ' ';
        // // Scroll the tab contents like a marquee
        //setInterval(function() {
        //    var movedchar = title.slice(0,1);
        //    title = title.slice(1) + movedchar;
        //    document.title = title;
        //    console.log(movedchar);
        //}, 700);

        // Check the money amount of the order.
        total = total.replace(/\$/g, '');
        total = total.replace(/\,/g, '');
        total = parseInt(total, 10);

        if (total < 300) {
            $(total_box).css(safe);
        } else if (total > 500) {
            $(total_box).css(maybe);
        } else {
            $(total_box).css(warning);
        }

        // Check the billing state.
        if (bill_state == 'OR' || bill_state == 'DE' || bill_state == 'NJ') {
            $(bill_state_box).css(safe);
        }

        // Check the shipping state.
        if (ship_state == 'OR' || ship_state == 'DE' || ship_state == 'NJ') {
            $(ship_state_box).css(safe);
        }

        // Check the shipping method.
        if (ship_method == 'Next Day Air Saver') {
            $(ship_method_box).css(warning);
        } else if (ship_method == '2nd Day Air') {
            $(ship_method_box).css('maybe');
        }

        // Check the billing country.
        if ( bill_country == 'CN' || bill_country == 'HK' || bill_country == 'JP' || bill_country == 'KR' || bill_country == 'TW' ) {
            $(bill_country_box).css(safe);
        }

        // Check order status.
        $("table#ctl00_cphMainContent_gvOrderDetails tbody tr td table.DGItem tbody tr:nth-child(1):not(.DGHeader) td:nth-child(10)").each(function () {
            var status = $(this).text();
            if (status == "shipped" || status == "DROPship" || status == "Auto-Filled from Internet") {
                $(this).css(warning);
            } else if (status == "WAITING" || status == "WTV" || status == "ITV" || status == "Reprocess Flagged Order") {
                $(this).css(maybe);
            }
        });

        // Check brands prohibited for reselling, and check key fraud brands.
        $("table#ctl00_cphMainContent_gvOrderDetails tbody tr td table.DGItem tbody tr:nth-child(1):not(.DGHeader) td:nth-child(5)").each(function () {
            var product = $(this).text();
            number_of_products++;
            if (product.indexOf("Canada Goose") != -1 || product.indexOf("Moosejaw Gift Card") != -1) {
                $(this).css(maybe);
            } else if (product.indexOf("Ugg") != -1 || product.indexOf("Garmin") != -1 || product.indexOf("GoPro") != -1 || product.indexOf("Birkenstock") != -1 || product.indexOf("Reef") != -1) {
                $(this).css(warning);
            }
        });

        // When user adds a status, and there is only one product,
        // it is a waste of time to pop up an alert asking them to select some products.
        // Therefore, check the "check all" checkbox (if it is not already checked).
        if (number_of_products == 1) {
            select_status.on('change', function() {
                if (chk_select_all.prop('checked') ===  false) {
                    chk_select_all.trigger("click");
                }
            });
        }

        // Flag differences between billing address and shipping address.
        if (bill_first_name.toUpperCase() != ship_first_name.toUpperCase()) {
            bill_first_name_box.css(maybe);
            ship_first_name_box.css(maybe);
        }
        if (bill_last_name.toUpperCase() != ship_last_name.toUpperCase()) {
            bill_last_name_box.css(maybe);
            ship_last_name_box.css(maybe);
        }
        bill_address_one = bill_address_one.replace('Road', 'Rd');
        ship_address_one = ship_address_one.replace('Road', 'Rd');
        bill_address_one = bill_address_one.replace('Drive', 'Dr');
        ship_address_one = ship_address_one.replace('Drive', 'Dr');
        bill_address_one = bill_address_one.replace('Avenue', 'Ave');
        ship_address_one = ship_address_one.replace('Avenue', 'Ave');
        // No need to flag mismatches in punctuation, so, remove all of it from the comparison
        bill_address_one = bill_address_one.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        ship_address_one = ship_address_one.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        if (bill_address_one.toUpperCase() != ship_address_one.toUpperCase()) {
            bill_address_one_box.css(maybe);
            ship_address_one_box.css(maybe);
        }
        if (bill_address_two.toUpperCase() != ship_address_two.toUpperCase()) {
            bill_address_two_box.css(maybe);
            ship_address_two_box.css(maybe);
        }
        if (bill_city.toUpperCase() != ship_city.toUpperCase()) {
            bill_city_box.css(maybe);
            ship_city_box.css(maybe);
        }

        // Get the list of all known reshipper addresses
        //shippers = localStorage.getItem('shippers');

        //ship_address = {
        //    "street": ship_address_one,
        //    "city": ship_city,
        //    "state": ship_state
        //};

        // Create an "Add to reshipper list" button
        //$("#ctl00_cphMainContent_lblCommentOut")
        //    .html("Reshipper? <button id='addToshippers'>Add</button>")
        //    .click(function() {
        //    localStorage.setItem('shippers', shippers + ship_address);
        //});

        //if (shippers) {
        //    for (var k = 0, len = shippers.length; k < len; k++) {
        //        if (shippers[k].street == ship_address.street && shippers[k].city == ship_address.city && shippers[k].state == ship_address.state) {
        //            $("#ctl00_cphMainContent_lblCommentOut").text('This is a reshipper').css(safe);
        //        }
        //    }
        //}

        // Flag email address if it's outlook, or letters followed by numbers
        // Flag it as safe if it's Walmart or Jet
        if (email_domain === 'outlook' || /[a-zA-Z]+\d+$/.test(emaillocal) ) {
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
                if (pay_methods[j] !== 'Gift Card' || pay_methods_list.includes('Gift Card') === false) {
                    pay_methods_list = pay_methods_list + separator + pay_methods[j];
                }
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

        // Shorten title on several tabs to make it less likely to line-wrap the Risk tab
        notes_tab.text("Notes");
        tax_tab.text("Tax");
        promo_tab.text("Promos");
        info_tab.text("Add'l Info");

        // Display Signifyd status
        risk_tab.text(signifyd + ' ');
        if (signifyd.indexOf('Rejected') !== -1) {
            risk_tab.css('color', '#c62201');
        } else if (signifyd.indexOf('Approved') !== -1) {
            risk_tab.css('color', '#01772b');
        }

        // Show the link to Signifyd in the risk tab.
        risk_tab.append(signifyd_link.clone());

        // Find out geolocation of IP address.
        if (ip.startsWith('172.16')) {
            displayGeolocation('Ordered by phone');
        } else if (ip.startsWith('192.168')) {
            displayGeolocation('Ordered in store');
        } else {
            $.getJSON('https://ipapi.co/'+ ip +'/json')
                .done(function(json){
                displayGeolocation('Placed from an internet connection in ' + json.city + ' ' + json.region + ' ' + json.country + '. ');
            })
                .fail(function(jqxhr, textStatus, error){
                displayGeolocation('IP lookup failed');
            });
        }

        function displayGeolocation(g) {
            //Display geolocation of IP address.
            if ( $("#iplookup").length ) {
                $("#iplookup").text(g);
            } else {
                main_table.append('<td id="iplookup" colspan=2 class="Label">' + g + '</td>');
            }
        }

        // Find out bank and display it.
        if (credit_card) {
            bin_url = 'https://lookup.binlist.net/' + bin.substr(0,6);
            $.getJSON(bin_url)
                .done( function(json){
                json.bank.name = json.bank.name ? json.bank.name + ', ' : '';
                json.brand = json.brand ? json.brand + ', ' : '';
                displayBank('Card issuer is ' + json.brand + json.bank.name + json.country.name + '. ');
            })
                .fail (function(json){
                displayBank('Bank lookup failed');
            });
        } else {
            displayBank('No card');
        }

        function displayBank(b) {
            if ( $("#banklookup").length ) {
                $("#banklookup").text(b);
            } else {
                main_table.append('<td id="banklookup" colspan=2 class="Label">' + b + '</td>');
            }
        }

        //var displayWPP = function () {
            //var baseurl = "https://proapi.whitepages.com/3.2/identity_check.json?primary.name=";
            //var url = baseurl + bill_first_name + "+" + bill_last_name + ;
            //"Drama+Number&primary.phone=6464806649&primary.address.street_line_1=302+Gorham+Ave&primary.address.city=Ashland&primary.address.state_code=MT&primary.address.postal_code=59004&primary.address.country_code=US&secondary.name=Fake+Name&secondary.phone=6464806649&secondary.address.street_line_1=302+Gorham+Ave&secondary.address.city=Ashland&secondary.address.state_code=MT&secondary.address.postal_code=59004&secondary.address.country_code=US&email_address=medjalloh1@yahoo.com&ip_address=64.124.61.215&api_key=API_KEY"
        //};

    }; // End improveOrderScreen()

    $(document).ready(function() {
        var refresh_btn_div = document.createElement('div');
        refresh_btn_div.id = 'refresh-btn-div';
        refresh_btn_div.style.position = "fixed";
        refresh_btn_div.style.left = "1rem";

        var refresh_btn = document.createElement('button');
        refresh_btn.id = 'refresh-btn';
        refresh_btn.innerHTML = "Refresh";
        refresh_btn.class = "button_small radius";
        // refresh_btn.onClick = improveOrderScreen;
        $('body').prepend(refresh_btn_div);
        $('#refresh-btn-div').append(refresh_btn);

        improveOrderScreen();
    }); // End documentready function

})();

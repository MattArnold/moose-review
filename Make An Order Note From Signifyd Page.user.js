// ==UserScript==
// @name         Make An Order Note From Signifyd Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect the most necessary information, convert it to layman's terms, and print it as a paragraph of text for a note on our own order screen.
// @author       Matt Arnold
// @require      https://gist.github.com/BrockA/2625891/raw/waitForKeyElements.js
// @include        https://app.signifyd.com/cases/*
// @match        https://app.signifyd.com/cases/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var done = 1;
        var overview_container = $('.case-analysis-wrap').first();
        var summary_boxes = $('.summary-points');

        var copy_div_wrapper = document.createElement('div');
        copy_div_wrapper.id = 'copy-div-wrapper';
        copy_div_wrapper.classList.add("row");

        var bad_div = document.createElement('div');
        bad_div.id = 'bad-div';
        bad_div.style.paddingBottom = "1rem";
        bad_div.classList.add("large-6", "columns");

        var good_div = document.createElement('div');
        good_div.id = 'good-div';
        good_div.style.paddingBottom = "1rem";
        good_div.classList.add("large-5", "columns");

        var refresh_btn_div = document.createElement('div');
        refresh_btn_div.id = 'refresh-btn-div';
        refresh_btn_div.style.paddingBottom = "1rem";
        refresh_btn_div.classList.add("large-1", "columns");

        var refresh_btn = document.createElement('button');
        refresh_btn.id = 'refresh-btn';
        refresh_btn.innerHTML = "Refresh";
        refresh_btn.class = "button_small radius";

        var createSummaries = function(){
            var s = summary_boxes.contents().text();

            // Remove commas from all the numbers. We'll lose all the other commas, but that is OK.
            s = s.replace(/,/g, '');

            var ship_mismatch_miles = /Delivery Address and Billing Address MISMATCH \(\d+ miles\)/;
            var da_to_ba = "0";
            if ( s.match(ship_mismatch_miles) ) {
                da_to_ba = s.match(ship_mismatch_miles)[0];
                da_to_ba = da_to_ba = da_to_ba.replace("Delivery Address and Billing Address MISMATCH (", "");
                da_to_ba = da_to_ba.replace(" miles)", "");
                if (parseInt(da_to_ba) !== 0) {
                    s = s.replace(/Delivery Address and Billing Address MISMATCH \(\d+ miles\)/g, 'Delivery ' + da_to_ba + ' miles away from card holder');
                }
                s = s.replace(ship_mismatch_miles, '');
            }

            s = s.replace(/Delivery Address and Billing Address MISMATCH/, 'Not shipping to billing address');

            var country_mismatch = /IP Geolocation country to Billing Address country mismatch \([\w- ]+\)/;
            var country_to_country = "0";
            if ( s.match(country_mismatch) ) {
                country_to_country = s.match(country_mismatch)[0];
                country_to_country = country_to_country = country_to_country.replace("Delivery Address and Billing Address MISMATCH (", "");
                country_to_country = country_to_country.replace(" miles)", "");
                if (parseInt(country_to_country) !== 0) {
                    s = s.replace(country_mismatch, 'Different country');
                }
                s = s.replace(country_mismatch, '');
            }

            var ip_mismatch = /Distance from IP Geolocation to Billing Address: \d+ miles/;
            var ip_to_ba = "0";
            if ( s.match(ip_mismatch) ) {
                ip_to_ba = s.match(ip_mismatch)[0];
                ip_to_ba = ip_to_ba = ip_to_ba.replace("Distance from IP Geolocation to Billing Address: ", "");
                ip_to_ba = ip_to_ba.replace(" miles", "");
                ip_to_ba = ip_to_ba.replace(',', '');
                if (parseInt(ip_to_ba) > 3) {
                    s = s.replace(ip_mismatch, 'Placed from an internet connection ' + ip_to_ba + ' miles away from card holder');
                }
                s = s.replace(/Distance from IP Geolocation to Billing Address: \d+ miles/g, '');
            }

            s = s.replace(/AVS: Full match/g, '');
            s = s.replace(/AVS: Complete failure/, 'Billing is nothing like what the bank has on file');
            s = s.replace(/AVS: Complete failure/g, '');
            s = s.replace(/Billing address is unreliable,? AVS not supported/, 'The bank could not confirm this billing address');
            s = s.replace(/Billing address is unreliable,? AVS not supported/g, '');
            s = s.replace(/Billing address is unreliable due to error in AVS/, 'The bank could not confirm this billing address');
            s = s.replace(/Billing address is unreliable due to error in AVS/g, '');
            s = s.replace(/AVS: Zip-only match/, 'Billing only matches the zip code the bank has on file');
            s = s.replace(/AVS: Zip-only match/g, '');
            s = s.replace(/AVS: Street-only match/, 'Billing only matches the street the bank has on file');
            s = s.replace(/AVS: Street-only match/g, '');
            s = s.replace(/fraudulent orders/, '<<< FRAUDULENT ORDERS >>>');
            s = s.replace(/fraudulent order(?!s)/, '<<< FRAUDULENT ORDER >>>');
            s = s.replace(/Across all merchants,? Signifyd has seen \d+ fraudulent orders? from [\w_\.@]+ out of \d+ total/, '');
            s = s.replace(/from [\w_\.@]+, out of \d+ total/g, 'from this email');
            s = s.replace(/orders? as bad from [\d\.]+/, 'orders as bad from this internet connection');
            s = s.replace(/Across all merchants,? Signifyd users have marked \d+ orders? as bad from [\d\.]+,? out of \d+ total/g, '');
            s = s.replace(/marked/g, '<<< MARKED AS BAD >>>');
            s = s.replace(/as bad/g, '');
            s = s.replace(/chargeback/, "<<< CHARGEBACK >>>");
            s = s.replace(/Across all merchants,? Signifyd has seen \d+ orders? with a chargeback from [\d\.]+,? out of \d+ total/g, '');
            s = s.replace(/Confirmation Email/g, 'email');
            s = s.replace(/\d+\.\d+\.\d+\.\d+ is an anonymous proxy/, 'Placed from an untraceable or falsified internet connection');
            s = s.replace(/\d+\.\d+\.\d+\.\d+ is an anonymous proxy/g, '');
            s = s.replace(/Across all merchants,? Signifyd has seen \d+ fraudulent orders? from [\w_\.@]+ out of \d+ total/, '');
            s = s.replace(/Signifyd has never seen an order from [\w\.]+@\w+\.[a-zA-Z]{2,3}/, 'Signifyd has never seen an order from this email');
            s = s.replace(/Signifyd has never seen an order from [\w\.]+@\w+\.[a-zA-Z]{2,3}/g, '');
            s = s.replace(/IP Geolocation and Billing Address country match but proximity is unknown/, "Internet connection cannot be located except that it is in the same country as the billing.");
            s = s.replace(/IP Geolocation region \([\w\s]+\) and Billing Address region \([\w\s]+\) mismatch/, "Internet connection in a different state from billing");
            s = s.replace(/IP Geolocation region \([\w\s]+\) and Billing Address region \([\w\s]+\) mismatch/g, "");
            s = s.replace(/IP from mobile carrier/, "Order placed from a smartphone");
            s = s.replace(/\d+.\d+.\d+.\d+ is primarily used by a business/, "Internet connection primarily used by a business");
            s = s.replace(/\d+.\d+.\d+.\d+ is primarily used by a business/g, "");

            // List the good things
            var good = '';
            if ( s.match(/Delivery Address and Billing Address match/) ) {
                good += "Shipping and billing match. ";
            }
            if ( s.match(/IP Geolocation city matches Billing Address city \([a-zA-Z]([\w -]*[a-zA-Z])\)/) ) {
                good += "Internet connection in same city as billing address. ";
            }
            if ( s.match(/User has active Twitter account/) ) {
                good += "User has active Twitter account. ";
            }
            if ( s.match(/Email is from a trusted domain owner/) ) {
                good += "Email is from a trusted domain owner. ";
            }
            if ( s.match(/Social Identity has same family name as Cardholder \([\w -]+\)/) ) {
                good += "Cardholder family name is connected to this on social media. ";
            }
            if ( s.match(/\.(\s*\w)+ is a trusted military delivery address/) ) {
                good += "Trusted military delivery address. ";
            }

            // Delete messages about factors that are not suspicious
            s = s.replace(/No analysis available/, '');
            s = s.replace(/this merchant/, 'Moosejaw');
            s = s.replace(/Across all merchants/g, '');
            s = s.replace(/Billing address unreliable due to AVS failure/g, ''); // Redundant
            s = s.replace(/Delivery Address and Billing Address match/g, '');
            s = s.replace(/Corporate credit card used/g, '');
            s = s.replace(/\d+\.\d+\.\d+\.\d+ originates from a hosting service/g, '');
            s = s.replace(/\d+\.\d+\.\d+\.\d+ belongs to a University/g, '');
            s = s.replace(/IP Geolocation [\w\s]+ matches Billing Address [\w\s]+ \([a-zA-Z]([\w -]*[a-zA-Z])\)/g, '');
            s = s.replace(/Signifyd has seen \d+ orders? from [\w_\.@]+ with \d+ of them more than 30 days old/g, '');
            s = s.replace(/At Moosejaw Signifyd has seen [\w_\.@]+ at least \d+ days ago/g, '');
            s = s.replace(/Buyer account with this merchant is \d+ days old with \d+ orders./g, '');

            s = s.replace(/User has active Twitter account/g, '');
            s = s.replace(/Email is from a trusted domain owner/, '');
            s = s.replace(/Age of email is at least \d+ days old/g, '');
            s = s.replace(/Social Identity has same family name as Cardholder \([\w -]+\)/, '');

            // Format the whole text just a bit for punctuation and grammar.
            s = s.replace(/\d more\.\.\./g, '');
            s = s.replace(/\n+\s+/g, '. ');
            // This message starts with a random address so it needs to have the periods added to sentences first, to identify the start of the sentence and delete it
            s = s.replace(/\.(\s*\w)+ is a trusted military delivery address/, '');
            s = s.replace(/Address\./, '');
            s = s.replace(/\sDevice\./, '');
            s = s.replace(/\sEmail\./, '');
            s = s.replace(/\s+/g, ' ');
            s = s.replace(/\.+/g, '.');
            s = s.replace(/-\./g, '');
            s = s.replace(/^\.\s/, '');

            var titleCase = function(str) {
                return str.toLowerCase().split(' ').map(function(word) {
                    return word.replace(word[0], word[0].toUpperCase());
                }).join(' ');
            };

            var bank_name = $('[ng-show="codDetails.ceditCardIssuer.details.bankName"]').text().trim().replace(/\s+/, ' ');
            bank_name = titleCase(bank_name);
            s = (bank_name !== "Bank:") ? s + bank_name + "." : s;

            var addresses = $('[ng-show="!loc.details.street.length"]').toArray();
            $.each(addresses, function() {
                var enclosing_box = $(this).parent().parent()[0].innerText;
                if (enclosing_box.indexOf('IP Geolocation') !== -1) {
                    s = (this.title !== '') ? s + " Placed from an internet connection at: " + this.title : s;
                }
            });

            bad_div.innerHTML = s;
            $('#bad-div').prepend("<h3>Everything Wrong In Layman's Terms: </h3>");

            good_div.innerHTML = good;
            $('#good-div').prepend("<h3>Everything Right In Layman's Terms: </h3>");

            //copy_div.addEventListener('click', function() {
            //    var range = document.createRange();
            //    range.selectNode(copy_div);
            //    copy_div.select();
            //    window.getSelection().addRange(range);
            //    document.execCommand('copy');
            //}, false);

        }; // end createSummaries

        waitForKeyElements ('.summary-points', function(){
            if (done == summary_boxes.length && summary_boxes.length > 0) {
                $('.case-detail')[0].prepend(copy_div_wrapper);
                $('#copy-div-wrapper').append(bad_div);
                $('#copy-div-wrapper').append(good_div);
                $('#copy-div-wrapper').append(refresh_btn_div);
                $('#refresh-btn-div').append(refresh_btn);
                createSummaries();
                refresh_btn.addEventListener('click', function(){
                    createSummaries();
                });
            } // end the if block
            done++;
        });

        waitForKeyElements ('.bubble__cross', createSummaries);

    }); //end of document ready
})();
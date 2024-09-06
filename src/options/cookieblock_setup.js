//-------------------------------------------------------------------------------
/*
Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group

This file is part of CookieBlock.

Released under the MIT License, see included LICENSE file.
*/
//-------------------------------------------------------------------------------

/**
 * Function that contains the localization text assignments.
 */
 const setupLocalization = function () {
    setStaticLocaleText("init_title", "extensionName");
    setStaticLocaleText("init_subtitle", "firstTimeSubtitle");

    setStaticLocaleText("setup_greet", "firstTimeGreeting");
    setStaticLocaleText("setup_desc1","firstTimeDescPG1");

    setStaticLocaleText("setup_desc2","firstTimeDescPG2", args = [], mark = true);

    setStaticLocaleText("setup_next_header", "firstTimeNextStepsHeader");
    setStaticLocaleText("setup_next_desc","firstTimeNextStepsDesc", args = [], mark = true);

    setStaticLocaleText("classify_title", "currentCookieEnforceTitle");
    setStaticLocaleText("classify_desc", "currentCookieEnforceDescriptionSetup");
    setStaticLocaleText("set_policy","buttonExitSetup");

    setStaticLocaleText("cprefs_legend", "headerAdvancedSettings");
    setStaticLocaleText("cprefs_desc","consentDescription", args = [], mark = true);
    setStaticLocaleText("nec_title","catNecessaryTitle");
    setStaticLocaleText("nec_desc","catNecessaryDesc");
    setStaticLocaleText("func_title","catFunctionalityTitle");
    setStaticLocaleText("func_desc","catFunctionalityDesc");
    setStaticLocaleText("anal_title","catAnalyticsTitle");
    setStaticLocaleText("anal_desc","catAnalyticsDesc");
    setStaticLocaleText("advert_title","catAdvertisingTitle");
    setStaticLocaleText("advert_desc","catAdvertisingDesc");

    setStaticLocaleText("history_consent_title", "historyConsentTitle");
    setStaticLocaleText("history_consent_desc", "historyConsentDesc");
    setStaticLocaleText("history_why", "historyWhy");
    setStaticLocaleText("history_consent_desc_detailed", "historyConsentDescDetailed");

    setStaticLocaleText("setup_references", "references", args = [], mark = true);
}

/**
 * Switch recommended store links according to browser name for Firefox, Chrome, Edge, and Opera
 */
function browserLinkUpdate() {
    isdcacLink = document.querySelector('a[href="https://www.i-dont-care-about-cookies.eu/"]');
    ublockLink = document.querySelector('a[href="https://ublockorigin.com/"]');
    cOmLink = document.querySelector('a[href="https://github.com/cavi-au/Consent-O-Matic"]');
    pin_img = document.querySelector('img[src="/static/installation_pin.gif"]');
    // if browser is Firefox:
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        isdcacLink.href = "https://addons.mozilla.org/firefox/addon/istilldontcareaboutcookies/";
        ublockLink.href = "https://addons.mozilla.org/firefox/addon/ublock-origin/";
        cOmLink.href = "https://addons.mozilla.org/firefox/addon/consent-o-matic/";
        pin_img.src = "/static/installation_pin.gif"; // TODO: create
    } else if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) { //edge
        // no I still don't care about cookies - point to Chrome store
        isdcacLink.href = "https://chrome.google.com/webstore/detail/i-still-dont-care-about-c/edibdbjcniadpccecjdfdjjppcpchdlm";
        ublockLink.href = "https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak";
        cOmLink.href = "https://chrome.google.com/webstore/detail/consent-o-matic/mdjildafknihdffpkfmmpnpoiajfjnjd";
        pin_img.src = "/static/installation_pin_edge.gif";
    } else if (navigator.userAgent.toLowerCase().indexOf('opera') > -1) { //opera
        // no I still don't care about cookies - point to Chrome store
        isdcacLink.href = "https://chrome.google.com/webstore/detail/i-still-dont-care-about-c/edibdbjcniadpccecjdfdjjppcpchdlm";
        ublockLink.href = "https://addons.opera.com/en/extensions/details/ublock/";
        cOmLink.href = "https://chrome.google.com/webstore/detail/consent-o-matic/mdjildafknihdffpkfmmpnpoiajfjnjd";
        pin_img.src = "/static/installation_pin.gif"; // TODO: create
    } else {
        // use Chrome store as default
        isdcacLink.href = "https://chrome.google.com/webstore/detail/i-still-dont-care-about-c/edibdbjcniadpccecjdfdjjppcpchdlm";
        ublockLink.href = "https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm";
        cOmLink.href = "https://chrome.google.com/webstore/detail/consent-o-matic/mdjildafknihdffpkfmmpnpoiajfjnjd";
        pin_img.src = "/static/installation_pin.gif";
    }
}

/**
 * Helper for adding click listeners.
 */
const addPrefClickListener = function (checkboxID, idx) {
    let cb = document.getElementById(checkboxID);
    if (cb === null) {
        console.error(`Checkbox with ID ${checkboxID} not found!`);
        return;
    }
    cb.addEventListener("click", async (event) => {
        policy = await getStorageValue(chrome.storage.sync, "cblk_userpolicy");
        policy[idx] = cb.checked;
        setStorageValue(policy, chrome.storage.sync, "cblk_userpolicy");
    });
}

/**
 * This function is executed when opening the first time setup.
 */
const setupInitPage = async function() {
    setupLocalization();

    const histCheckbox = document.getElementById("history_consent_checkbox");
    const necessaryCheckbox = document.getElementById("nec_checkbox");
    const functionalityCheckbox = document.getElementById("func_checkbox");
    const analyticsCheckbox = document.getElementById("anal_checkbox");
    const advertisingCheckbox = document.getElementById("advert_checkbox");

    necessaryCheckbox.checked = true;
    functionalityCheckbox.checked = true;
    analyticsCheckbox.checked = false;
    advertisingCheckbox.checked = false;
    histCheckbox.checked = true;

    browserLinkUpdate();

    addPrefClickListener("nec_checkbox", 0);
    addPrefClickListener("func_checkbox", 1);
    addPrefClickListener("anal_checkbox", 2);
    addPrefClickListener("advert_checkbox", 3);

    // Set policy button
    document.getElementById("set_policy").addEventListener("click", (ev) => {
        document.getElementById("apply_text").hidden = false;
        chrome.runtime.sendMessage({"classify_all": true}, (msg) => {
            setStaticLocaleText("apply_text", "currentCookieEnforceMsg");
            console.log(`Process completed with message: ${msg}.`);

            // close once done
            //chrome.tabs.getCurrent(function(tab) {
            //    chrome.tabs.remove(tab.id, () => {});
            //})
        });
    });

    // consent checkbox
    histCheckbox.addEventListener("click", (ev) => {
        setStorageValue(histCheckbox.checked, chrome.storage.sync, "cblk_hconsent");
    });

}

document.addEventListener("DOMContentLoaded", setupInitPage);


/**
 * Update the toggles relevant to the setup page, based on changes in the local and sync storage.
 * @param {Object} changes Object containing the changes.
 * @param {Object} area Storage area that changed
 */
const updateSelectionOnChange = function(changes, area) {
    let changedItems = Object.keys(changes);
    if (area === "sync") {
        // update the consent checkboxes
        if (changedItems.includes("cblk_userpolicy")) {
            newPolicy = changes["cblk_userpolicy"].newValue;
            const necessaryCheckbox = document.getElementById("nec_checkbox");
            const functionalityCheckbox = document.getElementById("func_checkbox");
            const analyticsCheckbox = document.getElementById("anal_checkbox");
            const advertisingCheckbox = document.getElementById("advert_checkbox");
            necessaryCheckbox.checked = newPolicy[0];
            functionalityCheckbox.checked = newPolicy[1];
            analyticsCheckbox.checked = newPolicy[2];
            advertisingCheckbox.checked = newPolicy[3];
        }

        // update the history consent toggle
        if (changedItems.includes("cblk_hconsent")) {
            const histCheckbox = document.getElementById("history_consent_checkbox");
            histCheckbox.checked = changes["cblk_hconsent"].newValue;
        }
    }
}
chrome.storage.onChanged.addListener(updateSelectionOnChange);


// ==UserScript==
// @name         X Icon to Verified Bat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace the X icon with purple bat verification icon (also verifies purple bats)
// @author       Amity Slime
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Made in Adoble Illustranter
    const iconSVGPathDStr = "m129.516,37.731c-4.417,2.702,2.242,14.957-8.222,23.346-6.677,5.353-18.659,5.083-28.317,4.117,2.871-3.134,4.636-7.297,4.636-11.882v-2.734c0-.913.21-1.809.618-2.625,1.476-2.95,2.39-7.024,2.39-11.528,0-9.006-5.077-17.419-8.153-17.419-2.528,0-6.397,5.687-7.698,12.711-.066.357-.373.611-.736.594-1.296-.061-2.643-.096-4.034-.096s-2.738.035-4.034.096c-.362.017-.67-.237-.736-.594-1.301-7.024-5.17-12.711-7.698-12.711-3.077,0-8.153,8.414-8.153,17.419,0,4.503.914,8.577,2.39,11.528.409.817.618,1.712.618,2.625v2.272c0,4.684,1.833,9.02,4.8,12.278-9.565,1.017-21.657,1.42-28.481-4.051-10.465-8.389-3.805-20.644-8.222-23.346-4.113-2.516-27.484,17.032-27.484,56.372,0,18.191,1.758,29.104,2.625,33.379.126.623.985.713,1.238.129,1.809-4.171,6.905-13.555,16.138-13.555,9.478,0,12.211,12.685,12.928,17.8.085.606.891.772,1.204.246,1.966-3.309,7.037-9.888,16.277-9.888,12.344,0,16.817,14.968,26.591,14.968s14.247-14.968,26.591-14.968c9.24,0,14.311,6.579,16.277,9.888.313.526,1.119.36,1.204-.246.717-5.115,3.45-17.8,12.928-17.8,9.232,0,14.328,9.383,16.138,13.555.253.584,1.111.494,1.238-.129.867-4.276,2.625-15.188,2.625-33.379,0-39.339-23.371-58.888-27.484-56.372Zm-58.416,86.566l-24.704-24.697,9.191-9.193,15.099,15.096,31.97-34.901,9.586,8.781-41.143,44.915Z";
    const batVerificationSVG = (width, yOffset) => `<svg width="${width}" height="${width}" viewBox="0 0 160 ${160 - yOffset}"><path d="${iconSVGPathDStr}" style="fill: #741af8;"></path></svg>`;

    // Replace the logo once it is added to the page
    try {
        const targetNode = document.body;
        const config = { attributes: false, childList: true, subtree: true };
        const replaceLogo = (mutationList, observer) => {
            const logo = document.querySelector(`a[href="/home"][aria-label="X"] svg`);
            if (logo !== null) {
                logo.outerHTML = batVerificationSVG(32, 0);
                console.log("Bat verification: Logo replaced - observer disconnecting");
                observer.disconnect();
            }
        };
        const observer = new MutationObserver(replaceLogo);
        observer.observe(targetNode, config);
        console.log("Bat verification: Logo replacement initialized");
    } catch (err) {
        console.error("Bat verification:", err);
    }

    // Look for bats to verify anytime the page changes
    try {
        const targetNode = document.body;
        const config = { attributes: false, childList: true, subtree: true };
        const verifyBats = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    observer.disconnect();
                    let changes = 0;
                    for (const addedNode of mutation.addedNodes) {
                        if ((addedNode.querySelectorAll !== undefined)) {
                            const toReplace = addedNode.querySelectorAll('img[alt="🦇"]:has(+img[alt="🟣"])');
                            const toRemove = addedNode.querySelectorAll('img[alt="🦇"]+img[alt="🟣"]');
                            for (const item of toReplace) {
                                item.outerHTML = batVerificationSVG(item.height, 48);
                            }
                            for (const item of toRemove) {
                                item.remove();
                            }
                            changes += toReplace.length;
                        }
                    }
                    if (changes > 0) console.log("Bat verification: " + changes + " bat" + (changes !== 1 ? 's' : '') + " verified");
                    observer.observe(targetNode, config);
                }
            }
        };
        const observer = new MutationObserver(verifyBats);
        observer.observe(targetNode, config);
        console.log("Bat verification: bat verification initialized");
        // do i need to disconnect if the url changes?
    } catch (err) {
        console.log("Bat verification:", err);
    }
})();

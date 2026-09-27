(function () {
    'use strict';
    // Keep native long-press menus off game UI without cancelling touch gestures.
    let lastGameTouch = -Infinity;
    document.addEventListener('touchstart', () => { lastGameTouch = Date.now(); }, { capture: true, passive: true });
    document.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch') lastGameTouch = Date.now();
    }, { capture: true, passive: true });
    document.addEventListener('contextmenu', event => {
        if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
        if (event.pointerType === 'touch' || Date.now() - lastGameTouch < 2000) event.preventDefault();
    }, { capture: true });
    if ('serviceWorker' in navigator) window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
})();

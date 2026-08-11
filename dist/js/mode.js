/**
 * Mode manager — shared across all pages.
 * Reads / writes localStorage key 'rz_mode'.
 * Pages call initMode(fancyClass) where fancyClass is a string
 * added to <body> when fancy mode is active.
 */
(function () {
    var STORAGE_KEY = 'rz_mode';

    function applyMode(mode) {
        var body    = document.body;
        var toggle  = document.getElementById('mode-toggle');
        var splash  = document.getElementById('mode-splash');

        if (mode === 'fancy') {
            body.classList.add('fancy-mode');
            body.classList.remove('plain-mode');
            if (toggle) toggle.textContent = '◎ Plain Mode';
        } else {
            body.classList.remove('fancy-mode');
            body.classList.add('plain-mode');
            if (toggle) toggle.textContent = '✦ Fancy Mode';
        }

        // pages with separate plain/fancy divs
        var plainEl = document.getElementById('plain-content');
        var fancyEl = document.getElementById('fancy-content');
        if (plainEl && fancyEl) {
            plainEl.style.display = mode === 'fancy' ? 'none' : 'block';
            fancyEl.style.display = mode === 'fancy' ? 'block' : 'none';
        }

        localStorage.setItem(STORAGE_KEY, mode);
    }

    function dismissSplash(cb) {
        var splash = document.getElementById('mode-splash');
        if (!splash) { if (cb) cb(); return; }
        splash.classList.add('hidden');
        setTimeout(function () {
            splash.style.display = 'none';
            if (cb) cb();
        }, 400);
    }

    window.pickMode = function (mode) {
        dismissSplash(function () { applyMode(mode); });
    };

    window.toggleMode = function () {
        var current = localStorage.getItem(STORAGE_KEY) || 'plain';
        applyMode(current === 'fancy' ? 'plain' : 'fancy');
    };

    // Run on DOMContentLoaded
    function onReady() {
        var saved = localStorage.getItem(STORAGE_KEY);
        var splash = document.getElementById('mode-splash');

        // Default to fancy if no preference saved yet
        var mode = saved || 'fancy';
        if (splash) splash.style.display = 'none';
        applyMode(mode);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();

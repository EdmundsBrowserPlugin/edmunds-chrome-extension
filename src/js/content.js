require([
    'app/content'
], function(App) {

    chrome.storage.local.get('collapsedPanel', function(response) {
        /* jshint unused:false */
        var app = new App({
            collapsedPanel: response.collapsedPanel
        });
    });

});

require([
    'app/content'
], function(App) {

    _.mixin({

        formatNumber: function(value) {
            return (Number(value) || 0).toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(',');
        }

    });

    chrome.storage.local.get('collapsedPanel', function(response) {
        /* jshint unused:false */
        var app = new App({
            collapsedPanel: response.collapsedPanel
        });
    });

});

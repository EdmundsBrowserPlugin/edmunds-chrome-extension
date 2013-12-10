require.config({

    baseUrl: chrome.runtime.getURL('/js'),

    paths: {
        'google-analytics': 'https://ssl.google-analytics.com/ga',
        'text': '../lib/requirejs/text'
    },

    shim: {
        'google-analytics': {
            exports: '_gaq'
        }
    }

});

_.mixin({

    formatNumber: function(value) {
        return (Number(value) || 0).toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(',');
    }

});

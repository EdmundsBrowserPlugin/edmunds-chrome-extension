require.config({

    baseUrl: chrome.extension.getURL('/js'),

    paths: {
        'google-analytics': 'https://ssl.google-analytics.com/ga',
        text: '../lib/requirejs/text'
    },

    shim: {
        'google-analytics': {
            exports: '_gaq'
        }
    }

});

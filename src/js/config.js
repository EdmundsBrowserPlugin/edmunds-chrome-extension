require.config({

    baseUrl: chrome.runtime.getURL('/js'),

    skipDataMain: true,

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

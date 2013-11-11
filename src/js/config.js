require.config({

    baseUrl: chrome.extension.getURL('/js'),

    paths: {
        jquery: 'lib/jquery/jquery',
        underscore: 'lib/underscore/underscore'
    },

    shim: {
        underscore: {
            exports: '_'
        }
    }

});

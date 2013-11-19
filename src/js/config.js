require.config({

    baseUrl: chrome.extension.getURL('/js'),

    paths: {
        jquery: 'lib/jquery/jquery',
        underscore: 'lib/underscore/underscore',
        text: 'lib/requirejs/text'
    },

    shim: {
        underscore: {
            exports: '_'
        }
    }

});

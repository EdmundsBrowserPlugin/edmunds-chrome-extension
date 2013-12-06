define([
    'app/base',
    'view/options/zip',
    'view/options/blacklist'
], function(App, ZipView, BlackListView) {

    return App.extend({

        initialize: function(options) {
            console.log('OptionsApp#initialize');
            App.prototype.initialize.call(this, options);
            this.initializeZipView();
            this.initializeBlackListView();
        },

        initializeZipView: function() {
            var view = new BlackListView();
            console.log('OptionsApp#initializeZipView');
            view.on('add', function(url) {
                chrome.runtime.sendMessage({ action: 'stopContentApplications', data: url });
            });
            view.on('remove', function(url) {
                chrome.runtime.sendMessage({ action: 'startContentApplications', data: url });
            });
        },

        initializeBlackListView: function() {
            /* jshint unused:false */
            var view = new ZipView();
            console.log('OptionsApp#initializeBlackListView');
        }

    });

});

define([
    'app/base'
], function(App) {

    return App.extend({

        initialize: function(options) {
            console.log('BackgroundApp#initialize');
            App.prototype.initialize.call(this, options);
            this.initializeBrowserAction();
        },

        initializeBrowserAction: function() {
            console.log('BackgroundApp#initializeBrowserAction');
            chrome.browserAction.onClicked.addListener(function() {
                chrome.tabs.create({
                    url: 'http://www.edmunds.com'
                });
            });
        },

        handleRuntimeMessage: function(message) {
            console.log('BackgroundApp#handleRuntimeMessage');
            switch (message.action) {
                case 'startContentApplications':
                    this.startContentApplications(message.data);
                    break;
                case 'stopContentApplications':
                    this.stopContentApplications(message.data);
                    break;
            }
        },

        startContentApplications: function(url) {
            console.log('BackgroundApp#startContentApplications');
            chrome.tabs.query({ url: url + '/*' }, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'start' });
                }, this);
            }.bind(this));
            this.createNotification(url + ' was removed from black list.');
        },

        stopContentApplications: function(url) {
            console.log('BackgroundApp#stopContentApplications');
            chrome.tabs.query({ url: url + '/*' }, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'stop' });
                }, this);
            }.bind(this));
            this.createNotification(url + ' was added to black list.');
        },

        createNotification: function(message) {
            console.log('BackgroundApp#createNotification');
            chrome.notifications.create('', {
                type: 'basic',
                title: 'Edmunds Buddy',
                message: message,
                iconUrl: 'img/icon/128.png'
            }, function() {});
        }

    });

});

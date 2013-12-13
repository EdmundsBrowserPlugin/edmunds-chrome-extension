define([
    'app/base'
], function(App) {

    return App.extend({

        defaults: {
            updatePeriod: 30 * 24 * 60 * 60 * 1000
        },

        initialize: function(options) {
            console.log('BackgroundApp#initialize');
            App.prototype.initialize.call(this, options);
            this.initializeBrowserAction();
            this.checkForUpdate();
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
                case 'dispatchPanelEvent':
                    this.dispatchPanelEvent(message.data);
                    break;
            }
        },

        startContentApplications: function(url) {
            console.log('BackgroundApp#startContentApplications');
            chrome.tabs.query({ url: url + '/*' }, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'start' });
                });
            });
        },

        stopContentApplications: function(url) {
            console.log('BackgroundApp#stopContentApplications');
            chrome.tabs.query({ url: url + '/*' }, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'stop' });
                });
            });
        },

        dispatchPanelEvent: function(action) {
            console.log('BackgroundApp#dispatchPanelEvent');
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { action: action });
                });
            });
        },

        checkForUpdate: function() {
            console.log('#checkForUpdate');
            chrome.storage.local.get('lastUpdateDate', function(response) {
                if (!response.lastUpdateDate || (Date.now() - response.lastUpdateDate > this.options.updatePeriod)) {
                    this.updateMakeModels();
                }
            }.bind(this));
        },

        updateMakeModels: function() {
            console.log('#updateMakeModels');
            jQuery.ajax({
                url: 'http://www.edmunds.com/api/vehicle/v2/makes',
                data: {
                    state: ['new', 'used']
                },
                dataType: 'json',
                traditional: true,
                success: function(response) {
                    var makeModelsMap = {};
                    _.each(response.makes, function(make) {
                        makeModelsMap[make.name] = [];
                        _.each(make.models, function(model) {
                            makeModelsMap[make.name].push(model.name);
                        });
                    });
                    chrome.storage.local.set({
                        lastUpdateDate: Date.now(),
                        makeModelsMap: makeModelsMap
                    });
                }
            });
        }

    });

});

define([
    'app/Base',
    'parser/default',
    'util/storage',
    'util/special-offers-manager',
    'util/ga'
], function(App, DefaultParser, storage, man, GoogleAnalytics) {

    return App.extend({

        initialize: function() {
            App.prototype.initialize.apply(this, arguments);
            GoogleAnalytics.setAccount('UA-46028925-1').trackPageView();
        },

        /**
         * @method sendTabAction
         * @param {Number} tabId
         * @param {String} name
         * @param {Object} data
         * @chainable
         */
        sendTabAction: function(tabId, name, data) {
            console.log('BackgroundApp#sendTabAction');
            chrome.tabs.sendMessage(tabId, {
                action: name,
                data: data
            });
            return this;
        },

        /**
         * @override
         */
        onMessage: function(message, sender) {
            console.log('BackgroundApp#onMessage');
            if (message.action) {
                this.handleAction(message.action, message.data, sender);
            }
        },

        handleAction: function(action, data, sender) {
            console.log('BackgroundApp#doAction');
            switch (action) {
                case 'parseDocument':
                    this.parseDocument(data, sender);
                    break;
                case 'fetchSpecialOffers':
                    this.fetchSpecialOffers(data, sender);
                    break;
                case 'trackEvent':
                    GoogleAnalytics.trackEvent(data.category, data.action, data.label, data.value);
                    break;
                case 'setZip':
                    this.setZip(data);
                    break;
                default:
                    console.log('Unknown action');
            }
        },

        parseDocument: function(data, sender) {
            console.log('BackgroundApp#parseDocument');
            if (!sender.url) {
                return;
            }
            console.log('Parsing ' + sender.url);
            storage.getMakeModels(function(response) {
                var vehicles = DefaultParser.parse(data, response.makeModels);
                if (sender.tab) {
                    this.fetchSpecialOffers(vehicles, sender);
                }
            }.bind(this));
        },

        fetchSpecialOffers: function(vehicles, sender) {
            var requests = [],
                zip = this.zip;
            console.log('#fetchSpecialOffers');
            _.each(vehicles, function(models, make) {
                _.each(models, function(years, model) {
                    requests.push(man.fetchSpecialOffers(make, model, years, zip));
                });
            });
            return $.when.apply({}, requests).done(function() {
                var offers = {},
                    args = [].slice.call(arguments);
                _.each(args, function(data) {
                    if (data.offers.length === 0) {
                        return;
                    }
                    if (!offers[data.make]) {
                        offers[data.make] = {};
                    }
                    offers[data.make][data.model] = data.offers;
                });
                this.sendTabAction(sender.tab.id, 'updateSpecialOffers', offers);
            }.bind(this));
        },

        setZip: function(zip) {
            this.zip = zip;
            // send message into all content scripts
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'setZip',
                        data: zip
                    });
                });
            });
            return this;
        }

    });

});

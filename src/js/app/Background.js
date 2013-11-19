define([
    'app/Base',
    'parser/default',
    'util/storage',
    'util/special-offers-manager',
    'underscore',
    'jquery'
], function(App, DefaultParser, storage, man, _, $) {

    return App.extend({

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
                this.doAction(message.action, message.data, sender);
            }
        },

        doAction: function(action, data, sender) {
            console.log('BackgroundApp#doAction');
            switch (action) {
                case 'parseDocument':
                    this.parseDocument(data, sender);
                    break;
                case 'fetchSpecialOffers':
                    this.fetchSpecialOffers(data, sender);
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
                    //this.sendTabAction(sender.tab.id, 'updateVehicles', vehicles);
                    this.fetchSpecialOffers(vehicles, sender);
                }
            }.bind(this));
        },

        fetchSpecialOffers: function(vehicles, sender) {
            var requests = [];
            console.log('#fetchSpecialOffers');
            _.each(vehicles, function(models, make) {
                _.each(models, function(years, model) {
                    requests.push(man.fetchSpecialOffers(make, model, years));
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
        }

    });

});

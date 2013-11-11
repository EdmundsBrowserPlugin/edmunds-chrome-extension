define([
    'app/Base',
    'parser/default',
    'util/storage'
], function(App, DefaultParser, storage) {

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
                default:
                    console.log('Unknown action');
            }
        },

        parseDocument: function(data, sender) {
            var startTime = Date.now();
            console.log('BackgroundApp#parseDocument');
            if (!sender.url) {
                return;
            }
            console.log('Parsing ' + sender.url);
            storage.getMakeModels(function(response) {
                var vehicles = DefaultParser.parse(data, response.makeModels);
                if (sender.tab) {
                    this.sendTabAction(sender.tab.id, 'updateVehicles', vehicles);
                }
                console.log('\t' + [
                    'length: ' + data.length,
                    'time: ' + ((Date.now() - startTime) / 1000) + 's'
                ].join('\n\t'));
            }.bind(this));
        }

    });

});

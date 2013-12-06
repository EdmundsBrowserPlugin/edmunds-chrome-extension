define([
    'app/base',
    'storage/blacklist'
], function(App, BlackListStorage) {

    return App.extend({

        defaults: {
            parsingPeriod: 2000
        },

        initialize: function(options) {
            console.log('ContentApp#initialize');
            App.prototype.initialize.call(this, options);

            this.onDocumentChange = this.onDocumentChange.bind(this);
            this.parseDocument = _.throttle(this.parseDocument, options.parsingPeriod);

            BlackListStorage.get(function(items) {
                if (!_.contains(items, location.origin)) {
                    this.start();
                }
            }.bind(this));

            this.btn = $('<button>exclude host</button>');
        },

        handleRuntimeMessage: function(message) {
            console.log('ContentApp#handleRuntimeMessage');
            switch (message.action) {
                case 'stop':
                    this.stop();
                    break;
                case 'start':
                    this.start();
                    break;
            }
        },

        onDocumentChange: function() {
            console.log('ContentApp#onDocumentChange');
            this.parseDocument();
        },

        parseDocument: function() {
            console.log('ContentApp#parseDocument');
        },

        stop: function() {
            console.log('ContentApp#stop');
            document.removeEventListener('DOMSubtreeModified', this.onDocumentChange);
            this.btn.remove();
        },

        start: function() {
            console.log('ContentApp#start');
            this.parseDocument();
            document.addEventListener('DOMSubtreeModified', this.onDocumentChange);
            $('body').prepend(this.btn);
            this.btn.on('click', this.exclude.bind(this));
        },

        exclude: function() {
            var url = location.origin;
            console.log('ContentApp#exclude');
            BlackListStorage.add(url, function() {
                chrome.runtime.sendMessage({ action: 'stopContentApplications', data: url });
            });
        }

    });

});

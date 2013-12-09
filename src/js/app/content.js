define([
    'app/base',
    'storage/blacklist',
    'view/content/panel'
], function(App, BlackListStorage, PanelView) {

    return App.extend({

        defaults: {
            parsingPeriod: 2000
        },

        initialize: function(options) {
            console.log('ContentApp#initialize');
            App.prototype.initialize.call(this, options);
            this.initializePanel();
            this.onDocumentChange = this.onDocumentChange.bind(this);
            this.parseDocument = _.throttle(this.parseDocument, options.parsingPeriod);
            BlackListStorage.get(function(items) {
                if (!_.contains(items, location.origin)) {
                    this.start();
                }
            }.bind(this));
        },

        initializePanel: function() {
            var view = this.panel = new PanelView();
            view.on('close', this.stop, this);
            view.on('exclude', this.excludeUrl, this);
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

        getDocumentContent: function() {
            return document.body.innerText.replace(this.panel.el.innerText, '');
        },

        parseDocument: function() {
            console.log('ContentApp#parseDocument');
        },

        stop: function() {
            console.log('ContentApp#stop');
            document.removeEventListener('DOMSubtreeModified', this.onDocumentChange);
            this.panel.remove();
        },

        start: function() {
            console.log('ContentApp#start');
            this.panel.render();
            document.addEventListener('DOMSubtreeModified', this.onDocumentChange);
            this.parseDocument();
        },

        excludeUrl: function(url) {
            console.log('ContentApp#exclude');
            BlackListStorage.add(url, function() {
                chrome.runtime.sendMessage({ action: 'stopContentApplications', data: url });
            });
        }

    });

});

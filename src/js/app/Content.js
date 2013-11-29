define([
    'app/Base',
    'view/Panel'
], function(App, Panel) {

    return App.extend({

        initialize: function() {
            App.prototype.initialize.apply(this, arguments);
            document.addEventListener('DOMSubtreeModified', this.onDOMChange.bind(this));
            this.parseDocument = _.throttle(this.parseDocument, 2000);
            this.injectPanel();
        },

        onDOMChange: function(event) {
            var $el = $(event.target);
            if ($el.hasClass('edm-ext-panel')) {
                return;
            }
            if ($el.closest('.edm-ext-panel').length !== 0) {
                return;
            }
            this.parseDocument();
        },

        getDocumentContent: function() {
            return document.body.innerText.replace(this.panel.el.innerText, '');
        },

        injectPanel: function() {
            this.panel = new Panel();
            document.body.appendChild(this.panel.el);
            this.panel.on('track', this.trackEvent, this);
            return this;
        },

        /**
         * @override
         */
        onMessage: function(message) {
            console.log('ContentApp#onMessage');
            switch (message.action) {
                case 'updateSpecialOffers':
                    this.updateSpecialOffers(message.data);
                    break;
                case 'setZip':
                    this.parseDocument();
                    break;
            }
        },

        parseDocument: function() {
            console.log('ContentApp#parseDocument');
            this.sendAction('parseDocument', this.getDocumentContent());
        },

        updateSpecialOffers: function(response) {
            console.log('ContentApp#updateSpecialOffers');
            if (_.isEmpty(response)) {
                this.panel.resetSpecialOffers();
                return;
            }
            if (_.isEqual(response, this.previousResponse)) {
                return;
            }
            this.previousResponse = response;
            this.panel.setSpecialOffers(response);
        }

    });

});

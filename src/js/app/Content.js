define([
    'jquery',
    'underscore',
    'app/Base',
    'view/VehiclesPanel'
], function($, _, App, VehiclesPanel) {

    return App.extend({

        initialize: function() {
            App.prototype.initialize.apply(this, arguments);
            document.addEventListener('DOMSubtreeModified', this.onDOMChange.bind(this));
            this.parseDocument = _.throttle(this.parseDocument, 2000);
        },

        onDOMChange: function(event) {
            var $el = $(event.target);
            if ($el.hasClass('edm-panel')) {
                return;
            }
            if ($el.closest('.edm-panel').length !== 0) {
                return;
            }
            this.parseDocument();
        },

        getDocumentContent: function() {
            return document.body.innerText.replace(this.panel.el.innerText, '');
        },

        createVehiclesPanel: function() {
            this.panel = new VehiclesPanel();
            document.body.appendChild(this.panel.el);
        },

        /**
         * @override
         */
        onMessage: function(message) {
            console.log('ContentApp#onMessage');
            switch (message.action) {
                case 'updateVehicles':
                    this.updateVehicles(message.data);
                    break;
            }
        },

        parseDocument: function() {
            console.log('ContentApp#parseDocument');
            this.sendAction('parseDocument', this.getDocumentContent());
        },

        updateVehicles: function(vehicles) {
            console.log('ContentApp#updateVehicles');
            if (_.isEmpty(vehicles)) {
                this.panel.resetVehicles();
                return;
            }
            if (_.isEqual(vehicles, this.previousVehicles)) {
                return;
            }
            this.setVehicles(vehicles);
        },

        setVehicles: function(vehicles) {
            console.log('ContentApp#setVehicles');
            this.previousVehicles = vehicles;
            this.panel.setVehicles(vehicles);
        }

    });

});

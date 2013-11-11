define([
    'jquery',
    'underscore',
    'app/Base',
    'view/VehiclesPanel'
], function($, _, App, VehiclesPanel) {

    return App.extend({

        initialize: function() {
            App.prototype.initialize.apply(this, arguments);
            document.addEventListener('DOMSubtreeModified', function(e) {
                var $el = $(e.target);
                if ($el.hasClass('edm-panel')) {
                    console.log('**** panel');
                    return;
                }
                if ($el.closest('.edm-panel').length > 0) {
                    console.log('**** child');
                    return;
                }
                this.parseDocument();
            }.bind(this));
            this.sendParseAction = _.debounce(function() {
                this.sendAction('parseDocument', this.getDocumentContent());
            }.bind(this), 2000);
        },

        getDocumentContent: function() {
            var body = $(document.body).clone();
            body.find('.edm-panel').remove();
            return body.text();
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
            this.panel.setTitle('Parsing document...');
            this.sendParseAction();
        },

        updateVehicles: function(vehicles) {
            console.log('ContentApp#updateVehicles');
            if (_.isEmpty(vehicles)) {
                this.panel.resetVehicles();
                return;
            }
            this.panel.setVehicles(vehicles);
            this.panel.$el.removeClass('edm-parsing');
        }

    });

});

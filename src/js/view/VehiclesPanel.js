define([
    'jquery',
    'underscore'
], function($, _) {

    function VehiclesPanel() {
        this.initialize();
    }

    VehiclesPanel.prototype = {

        tagName: 'div',

        className: 'edm-panel',

        template: [
            '<div class="edm-head">Found Vehicles</div>',
            '<div class="edm-vehicles-list"></div>'
        ].join(''),

        initialize: function() {
            var me = this;
            this.el = document.createElement(this.tagName);
            this.$el = $(this.el);
            this.$el.addClass(this.className);
            this.$ = function(selector) {
                return this.$el.find(selector);
            };
            this.$el.html(this.template);
            this.$headEl = this.$('.edm-head');
            this.$headEl.on('dblclick', function() {
                me.hide();
            });
            this.$vehicleListEl = this.$('.edm-vehicles-list');
        },

        show: function() {
            this.$el.removeClass('edm-hide');
            return this;
        },

        hide: function() {
            this.$el.addClass('edm-hide');
            return this;
        },

        setTitle: function(text) {
            this.$headEl.text(text);
            return this;
        },

        resetVehicles: function() {
            this.setTitle('Vehicles were not found');
            return this;
        },

        setVehicles: function(data) {
            var list = this.$vehicleListEl;
            list.empty();
            this.setTitle('Found Vehicles');
            _.each(data, function(models, make) {
                _.each(models, function(years, model) {
                    if (years.length === 0) {
                        list.append('<div class="edm-vehicles-list-item">' + [make, model].join(' ') + '</div>');
                        return;
                    }
                    _.each(years.sort(), function(year) {
                        list.append('<div class="edm-vehicles-list-item">' + [year, make, model].join(' ') + '</div>');
                    });
                });
            });
            return this;
        }

    };

    return VehiclesPanel;

});

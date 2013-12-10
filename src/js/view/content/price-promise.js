define([
    'text!template/content/vehicle-item.html',
    'text!template/content/special-offer.html',
    'analytics/ga'
], function(vehicleItemTemplate, specialOfferTemplate, analytics) {

    var
        _activeClass = 'edm-ext-active',
        _disabledClass = 'edm-ext-disabled';

    // precompile templates
    vehicleItemTemplate = _.template(vehicleItemTemplate);
    specialOfferTemplate = _.template(specialOfferTemplate);

    return Backbone.View.extend({

        events: {
            'click .edm-ext-price-promise-btn': 'onClick',
            'click .edm-ext-vehicles-item': 'onVehicleClick'
        },

        initialize: function(options) {
            this[options.enabled ? 'enable' : 'disable']();
            $(document).on('click', function(event) {
                var $el = this.$el;
                if (!$el.is(event.target) && $el.has(event.target).length === 0) {
                    this.hideDropdown();
                }
            }.bind(this));
        },

        onClick: function() {
            if (this.isDisabled()) {
                return;
            }
            if (this.isActiveDropdown()) {
                this.hideDropdown();
                analytics.track('Price Promise', 'Click', 'Show dropdown');
            } else {
                this.showDropdown();
                analytics.track('Price Promise', 'Click', 'Hide dropdown');
            }
        },

        isDisabled: function() {
            return this.$el.hasClass(_disabledClass);
        },

        disable: function() {
            this.$el.addClass(_disabledClass);
            return this;
        },

        enable: function() {
            this.$el.removeClass(_disabledClass);
            return this;
        },

        isActiveDropdown: function() {
            return this.$el.hasClass(_activeClass);
        },

        hideDropdown: function() {
            this.$el.removeClass(_activeClass);
            return this;
        },

        showDropdown: function() {
            this.$el.addClass(_activeClass);
            return this;
        },

        setSpecialOffers: function(map, count) {
            console.log('#setSpecialOffers');
            this.$('.edm-ext-price-promise-count').text(count);
            this[count !== 0 ? 'enable' : 'disable']();
            this.renderVehicles(map);
            this.specialOffersMap = map;
        },

        renderVehicles: function(map) {
            var list = this.$('.edm-ext-vehicles');
            list.empty();
            _.each(map, function(models, make) {
                _.each(models, function(offers, model) {
                    var listItem = jQuery(vehicleItemTemplate({
                        make: make,
                        model: model,
                        count: offers.length
                    }));
                    listItem.data({
                        make: make,
                        model: model,
                        offers: offers
                    });
                    list.append(listItem);
                });
            });
            list.find('> :first-child').trigger('click');
        },

        onVehicleClick: function(event) {
            var $el = $(event.currentTarget),
                offers = $el.data('offers');
            this.renderSpecialOffers(offers);
            analytics.track('Vehicles List', 'Click', $el.text());
        },

        renderSpecialOffers: function(offers) {
            var list = this.$('.edm-ext-special-offers');
            list.empty();
            console.log(offers);
            _.each(offers, function(offer) {
                list.append(specialOfferTemplate(offer));
            });
        }

    });

});

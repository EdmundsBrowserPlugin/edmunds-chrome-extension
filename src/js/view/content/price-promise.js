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

    function _toQueryString(obj) {
        var queryParameters = [];
        _.each(obj, function(value, key) {
            queryParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
        return queryParameters.join('&');
    }

    return Backbone.View.extend({

        events: {
            'click .edm-ext-price-promise-btn': 'onClick',
            'click .edm-ext-vehicles-item': 'onVehicleClick',
            'click .edm-ext-special-offers-item .edm-ext-vehicle a': 'onOfferVehicleClick',
            'click .edm-ext-special-offers-item .edm-ext-price a': 'onOfferButtonClick'
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
            _.each(offers, function(offer) {
                offer.offerUrl = this.getOfferUrl(offer);
                offer.vehicleUrl = this.getVehicleUrl(offer);
                if (!offer.photoUrl || offer.photoUrl.indexOf('/') === 0) {
                    offer.photoUrl = chrome.runtime.getURL('/img/default-vehicle-photo.png');
                }
                list.append(specialOfferTemplate(offer));
            }, this);
            list.scrollTop(0);
        },

        getVehicleUrl: function(offer) {
            return 'http://www.edmunds.com/inventory/vin.html?' + _toQueryString({
                make: offer.make,
                model: offer.model,
                sub: offer.submodel,
                year: offer.year,
                trim: offer.trim,
                locationId: offer.locationId,
                franchiseId: offer.franchiseId,
                inventoryId: offer.id,
                zip: this.zip,
                'price_promise': true
            });
        },

        getOfferUrl: function(offer) {
            return 'http://www.edmunds.com/inventory/lead_form_certificate.html?' + _toQueryString({
                action: 'display',
                make: offer.make,
                model: offer.model,
                sub: offer.submodel,
                year: offer.year,
                trim: offer.trim,
                locationId: offer.locationId,
                franchiseId: offer.franchiseId,
                inventoryId: offer.id,
                zip: this.zip
            });
        },

        onOfferVehicleClick: function() {
            analytics.track('Special Offers', 'Click', 'Vehicle name');
        },

        onOfferButtonClick: function() {
            analytics.track('Special Offers', 'Click', 'View Price Now button');
        }

    });

});

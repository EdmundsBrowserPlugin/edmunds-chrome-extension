define([
    'text!template/panel.html',
    'text!template/special-offer.html'
], function(panelTemplate, specialOfferTemplate) {

    return Backbone.View.extend({

        className: 'edm-ext-panel',

        template: panelTemplate,

        initialize: function() {
            this.createElement();
            this.$vehicleListEl = this.$('.edm-ext-vehicles-list');
            // panel
            this.$('.edm-ext-price-promise-inner').on('click', function(event) {
                var parent = $(event.currentTarget).parent();
                if (parent.hasClass('disabled')) {
                    return;
                }
                parent.toggleClass('active');
                this.trigger('track', {
                    category: 'Price Promise',
                    action: parent.hasClass('active') ? 'Show' : 'Hide'
                });
            }.bind(this));
            // settings
            this.$('[data-action="settings"]').on('click', function() {
                this.trigger('track', {
                    category: 'Panel',
                    action: 'Settings'
                });
            }.bind(this));
            // close
            this.$('[data-action="close"]').on('click', function() {
                this.$el.remove();
                this.trigger('track', {
                    category: 'Panel',
                    action: 'Close'
                });
            }.bind(this));
            // vehicles list
            $(document).on('click', '.edm-ext-vehicles-list-item', function() {
                var $el = $(event.target);
                if (!$el.hasClass('edm-ext-vehicles-list-item')) {
                    $el = $el.closest('.edm-ext-vehicles-list-item');
                }
                console.log($el);
                this.renderOffers($el.data('offers'));
                this.trigger('track', {
                    category: 'Price Promise Vehicles List',
                    action: 'Select',
                    label: $el.find('.edm-ext-name').text()
                });
            }.bind(this));
            // special offers list
            $(document).on('click', '.edm-ext-special-offers-list-item button', function() {
                var $el = $(event.target);
                this.trigger('track', {
                    category: 'Special Offer',
                    action: 'View',
                    label: $el.text()
                });
            }.bind(this));
            // hide the price promise dropdown when the user clicks outside of it
            $(document).on('click', function(event) {
                var pp = this.$('.edm-ext-price-promise');
                if (!pp.is(event.target) && pp.has(event.target).length === 0) {
                    pp.removeClass('active');
                }
            }.bind(this));
        },

        renderOffers: function(offers) {
            var list = this.$('.edm-ext-special-offers-list');
            list.empty();
            _.each(offers, function(offer) {
                list.append(_.template(specialOfferTemplate, offer));
            });
            return this;
        },

        createElement: function() {
            this.el = document.createElement(this.tagName);
            this.$el = $(this.el);
            this.$el.addClass(this.className);
            this.$el.html(this.template);
            this.$ = function(selector) {
                return this.$el.find(selector);
            };
        },

        setSpecialOffers: function(response) {
            var list = this.$vehicleListEl,
                count = 0;
            list.empty();
            _.each(response, function(models, make) {
                _.each(models, function(offers, model) {
                    var el = $('<li class="edm-ext-vehicles-list-item"><span class="edm-ext-name"></span> <span class="edm-ext-count"></span></li>');
                    el.find('.edm-ext-name').text([make, model].join(' '));
                    el.find('.edm-ext-count').text('(' + offers.length + ')');
                    el.data('offers', offers);
                    list.append(el);
                    if (count === 0) {
                        this.renderOffers(offers);
                    }
                    count++;
                }, this);
            }, this);
            this.$('.edm-ext-found-vehicles').text(count + ' vehicles found');
            this.$('.edm-ext-price-promise')[count > 0 ? 'removeClass' : 'addClass']('disabled');
            return this;
        },

        resetSpecialOffers: function() {
            this.$('.edm-ext-found-vehicles').text('0 vehicles found');
            this.$('.edm-ext-price-promise').addClass('disabled').removeClass('active');
            return this;
        }

    });

});

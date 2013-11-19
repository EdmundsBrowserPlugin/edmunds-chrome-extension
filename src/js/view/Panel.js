define([
    'jquery',
    'underscore',
    'text!template/panel.html',
    'text!template/special-offer.html'
], function($, _, tpl, offerTpl) {

    function Panel() {
        this.initialize();
    }

    Panel.prototype = {

        tagName: 'div',

        className: 'edm-ext-panel',

        template: tpl,

        initialize: function() {
            this.createElement();
            this.$vehicleListEl = this.$('.edm-ext-vehicles-list');
            this.$('.edm-ext-price-promise-inner').on('click', function() {
                var parent = $(this).parent();
                if (parent.hasClass('disabled')) {
                    return;
                }
                parent.toggleClass('active');
            });
            this.$('[data-action="close"]').on('click', function() {
                this.$el.remove();
            }.bind(this));

            $(document).on('click', '.edm-ext-vehicles-list-item', function() {
                this.renderOffers($(event.target).data('offers'));
            }.bind(this));
        },

        renderOffers: function(offers) {
            var list = this.$('.edm-ext-special-offers-list');
            list.empty();
            _.each(offers, function(offer) {
                list.append(_.template(offerTpl, offer));
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
                    var el = $('<li class="edm-ext-vehicles-list-item"></li>');
                    el.text([make, model, '(' + offers.length + ')'].join(' ')).data('offers', offers);
                    console.log(model);
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

    };

    return Panel;

});

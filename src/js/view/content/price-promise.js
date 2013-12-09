define([
    'analytics/ga'
], function(analytics) {

    var
        _activeClass = 'edm-ext-active',
        _disabledClass = 'edm-ext-disabled';

    return Backbone.View.extend({

        events: {
            'click .edm-ext-price-promise-btn': 'onClick'
        },

        initialize: function(options) {
            this[options.enabled ? 'enable' : 'disable']();
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
        }

    });

});

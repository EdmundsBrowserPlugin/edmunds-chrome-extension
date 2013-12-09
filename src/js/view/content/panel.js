define([
    'view/content/price-promise',
    'text!template/content/panel.html',
    'analytics/ga'
], function(PricePromiseView, template, analytics) {

    return Backbone.View.extend({

        className: 'edm-ext-panel',

        template: _.template(template),

        events: {
            'click [data-action="toggle-view"]': 'onToggleViewClick',
            'click [data-action="close"]': 'onCloseClick',
            'click [data-action="exclude"]': 'onExcludeClick'
        },

        initialize: function(options) {
            this[options.collapsed ? 'collapse' : 'expand']();

        },

        initializePricePromise: function() {
            this.pricePromise = new PricePromiseView({
                el: this.$('.edm-ext-price-promise')
            });
        },

        render: function() {
            this.el.innerHTML = this.template();
            document.body.appendChild(this.el);
            this.initializePricePromise();
            return this;
        },

        collapse: function() {
            this.$el.addClass('edm-ext-panel-collapsed');
            return this;
        },

        expand: function() {
            this.$el.removeClass('edm-ext-panel-collapsed');
            return this;
        },

        onToggleViewClick: function() {
            if (this.$el.hasClass('edm-ext-panel-collapsed')) {
                this.expand();
                analytics.track('Extension Panel', 'Toggle View', 'Expand');
            } else {
                this.collapse();
                analytics.track('Extension Panel', 'Toggle View', 'Collapse');
            }
            return this;
        },

        onCloseClick: function() {
            this.trigger('close');
            analytics.track('Extension Panel', 'Close');
            return this;
        },

        onExcludeClick: function() {
            this.trigger('exclude', location.origin);
            analytics.track('Extension Panel', 'Exclude URL', location.origin);
            return this;
        }

    });

});

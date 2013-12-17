define([
    'view/content/price-promise',
    'text!template/content/panel.html',
    'analytics/ga'
], function(PricePromiseView, template, analytics) {

    var _collapsedClassName = 'edm-ext-panel-collapsed';

    return Backbone.View.extend({

        className: 'edm-ext-panel',

        template: _.template(template),

        events: {
            'click [data-action="toggle-view"]': 'onToggleViewClick',
            'click [data-action="minimize"]': 'onMinimizeClick',
            'click [data-action="close"]': 'onCloseClick',
            'click [data-action="exclude"]': 'onExcludeClick'
        },

        initialize: function(options) {
            this[options.collapsed ? 'collapse' : 'expand']();
            this.el.innerHTML = this.template();
            this.pricePromise = new PricePromiseView({
                el: this.$('.edm-ext-price-promise')
            });
            this.updateLogoTitle();
        },

        isRendered: function() {
            return this.$el.parent().length !== 0;
        },

        render: function() {
            if (this.isRendered()) {
                return this;
            }
            document.body.appendChild(this.el);
            this.delegateEvents();
            this.pricePromise.setElement(this.$('.edm-ext-price-promise'));
            return this;
        },

        collapse: function() {
            this.$el.addClass(_collapsedClassName);
            this.updateLogoTitle();
            return this;
        },

        expand: function() {
            this.$el.removeClass(_collapsedClassName);
            this.updateLogoTitle();
            return this;
        },

        isCollapsed: function() {
            return this.$el.hasClass(_collapsedClassName);
        },

        updateLogoTitle: function() {
            this.$('.edm-ext-logo').attr('title', chrome.i18n.getMessage(this.isCollapsed() ? 'minimized_panel_logo_title' : 'maximized_panel_logo_title'));
            return this;
        },

        onToggleViewClick: function() {
            if (this.isCollapsed()) {
                this.expand();
                this.trigger('expand');

            } else {
                this.collapse();
                this.trigger('collapse');
            }
            analytics.track('Extension Panel', 'Click', 'Logo');
            return this;
        },

        onCloseClick: function() {
            this.trigger('close');
            analytics.track('Extension Panel', 'Close');
            return this;
        },

        onExcludeClick: function() {
            this.trigger('exclude', location.origin);
            analytics.track('Extension Panel', 'Click', 'Exclude button');
            analytics.track('Extension Panel', 'Exclude URL', location.origin);
            return this;
        },

        onMinimizeClick: function() {
            this.collapse();
            this.trigger('collapse');
            analytics.track('Extension Panel', 'Click', 'Minimize button');
            return this;
        },

        setOffersCount: function(count) {
            this.$('.edm-ext-offers-count-label').text(count);
            return this;
        }

    });

});

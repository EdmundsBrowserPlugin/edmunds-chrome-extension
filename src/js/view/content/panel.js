define([
    'text!template/content/panel.html',
    'analytics/ga'
], function(template, analytics) {

    return Backbone.View.extend({

        className: 'edm-ext-panel',

        template: _.template(template),

        events: {
            'click [data-action="toggle-view"]': 'toggleView',
            'click [data-action="close"]': 'close',
            'click [data-action="exclude"]': 'exclude'
        },

        initialize: function() {
        },

        render: function() {
            this.el.innerHTML = this.template();
            document.body.appendChild(this.el);
            return this;
        },

        toggleView: function() {
            var className = 'edm-ext-panel-collapsed';
            if (this.$el.hasClass(className)) {
                this.$el.removeClass(className);
                analytics.track('Extension Panel', 'Toggle View', 'Expand');
            } else {
                this.$el.addClass(className);
                analytics.track('Extension Panel', 'Toggle View', 'Collapse');
            }
            return this;
        },

        close: function() {
            this.trigger('close');
            analytics.track('Extension Panel', 'Close');
            return this;
        },

        exclude: function() {
            this.trigger('exclude', location.origin);
            analytics.track('Extension Panel', 'Exclude URL', location.origin);
            return this;
        }

    });

});

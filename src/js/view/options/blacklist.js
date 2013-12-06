define([
    'storage/blacklist',
    'text!template/options/black-list-item.html',
    'analytics/ga'
], function(BlackListStorage, itemTemplate, analytics) {

    return Backbone.View.extend({

        el: $('#black-list-section'),

        itemTemplate: _.template(itemTemplate),

        events: {
            'keypress input[type="text"]': 'onKeypress',
            'click [data-action="add"]': 'onAdd',
            'click [data-action="remove"]': 'onRemove',
            'change select': 'onChangeUrlScheme'
        },

        initialize: function() {
            this.$input = this.$('input');
            this.$list = this.$('ul');
            BlackListStorage.get(this.renderList.bind(this));
            BlackListStorage.onChange(this.renderList.bind(this));
        },

        renderList: function(urls) {
            this.$list.empty();
            urls.forEach(function(url) {
                var listItem = this.itemTemplate({ url: url });
                this.$list.append(listItem);
            }, this);
            return this;
        },

        onAdd: function() {
            var url = this.$input.val().trim();
            this.$input.val('');
            if (url) {
                url = this.$('select').val() + url;
                BlackListStorage.add(url);
                this.trigger('add', url);
                analytics.track('Black List Settings', 'Add', url);
            }
        },

        onRemove: function(event) {
            var url = $(event.currentTarget).data('url');
            BlackListStorage.remove(url);
            this.trigger('remove', url);
            analytics.track('Black List Settings', 'Remove', url);
        },

        onKeypress: function(event) {
            var key = String.fromCharCode(event.charCode);
            if (/\//.test(key)) {
                event.preventDefault();
            }
        },

        onChangeUrlScheme: function(event) {
            analytics.track('Black List Settings', 'Change URL Scheme', $(event.target).val());
        }

    });

});

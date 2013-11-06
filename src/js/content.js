(function($, _) {

    var panel,
        parsePeriod = 2000,
        parseDocument;

    function Panel() {
        this.initialize();
    }

    Panel.prototype = {

        tagName: 'div',

        className: 'edm-panel',

        template: [
            '<ul class="vehicles-list"></ul>'
        ].join(''),

        initialize: function() {
            var me = this;
            this.el = document.createElement(this.tagName);
            this.$el = $(this.el);
            this.$el.addClass(this.className);
            this.$ = function(selector) {
                return this.$el.find(selector);
            };
            this.$el.on('dblclick', function() {
                me.hide();
            });
            this.$el.html(this.template);
            this.$vehicleListEl = this.$('.vehicles-list');
            this.vehicleListEl = this.$vehicleListEl[0];
        },

        render: function() {
            return this;
        },

        show: function() {
            this.$el.removeClass('edm-hide');
            return this;
        },

        hide: function() {
            this.$el.addClass('edm-hide');
            return this;
        },

        resetVehicles: function() {
            this.$vehicleListEl.html('<li class="edm-not-found">Vehicles were not found</li>');
            return this;
        },

        setVehicles: function(data) {
            var list = this.$vehicleListEl;
            list.empty();
            _.each(data, function(models, make) {
                _.each(models, function(years, model) {
                    if (years.length === 0) {
                        list.append('<li>' + [make, model].join(' ') + '</li>');
                        return;
                    }
                    _.each(years.sort(), function(year) {
                        list.append('<li>' + [year, make, model].join(' ') + '</li>');
                    });
                });
            });
            return this;
        }

    };

    function createPanel() {
        panel = new Panel();
        document.body.appendChild(panel.render().el);
        panel.hide();
    }

    function notify(text) {
        console.log(text);
        panel.show();
    }

    parseDocument = _.debounce(function() {
        chrome.runtime.sendMessage({
            action: 'parseDocument',
            data: document.body.innerText
        });
    }, parsePeriod);

    function updateVehicles(data) {
        var rows = ['*** Found Vehicles: ***'];
        if (_.isEmpty(data)) {
            notify('Not found vehicles');
            panel.resetVehicles();
            return;
        }
        _.each(data, function(models, make) {
            _.each(models, function(years, model) {
                if (years.length === 0) {
                    rows.push([make, model].join(' '));
                    return;
                }
                _.each(years.sort(), function(year) {
                    rows.push([year, make, model].join(' '));
                });
            });
        });
        notify(rows.join('\n'));
        panel.setVehicles(data).show();
    }

    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'updateVehicles') {
            updateVehicles(message.data);
        }
    });

    parseDocument = _.throttle(parseDocument, parsePeriod);

    createPanel();
    parseDocument();

    document.addEventListener('DOMSubtreeModified', function(e) {
        if (e.target !== panel.vehicleListEl) {
            parseDocument();
        }
    });

}(window.$, window._));

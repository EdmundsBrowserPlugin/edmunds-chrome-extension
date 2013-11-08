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
            '<div class="edm-head">Found Vehicles</div>',
            '<div class="edm-vehicles-list"></div>'
        ].join(''),

        initialize: function() {
            var me = this;
            this.el = document.createElement(this.tagName);
            this.$el = $(this.el);
            this.$el.addClass(this.className);
            this.$ = function(selector) {
                return this.$el.find(selector);
            };
            this.$el.html(this.template);
            this.$headEl = this.$('.edm-head');
            this.headEl = this.$headEl[0];
            this.$headEl.on('dblclick', function() {
                me.hide();
            });
            this.$vehicleListEl = this.$('.edm-vehicles-list');
            this.vehicleListEl = this.$vehicleListEl[0];
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
            this.$headEl.text('Vehicles were not found');
            this.$vehicleListEl.empty();
            return this;
        },

        setVehicles: function(data) {
            var list = this.$vehicleListEl;
            list.empty();
            this.$headEl.text('Found Vehicles');
            _.each(data, function(models, make) {
                _.each(models, function(years, model) {
                    if (years.length === 0) {
                        list.append('<div class="edm-vehicles-list-item">' + [make, model].join(' ') + '</div>');
                        return;
                    }
                    _.each(years.sort(), function(year) {
                        list.append('<div class="edm-vehicles-list-item">' + [year, make, model].join(' ') + '</div>');
                    });
                });
            });
            return this;
        }

    };

    function createPanel() {
        panel = new Panel();
        document.body.appendChild(panel.el);
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
        var targetEl = e.target;
        if (targetEl !== panel.el && targetEl !== panel.vehicleListEl && targetEl !== panel.headEl) {
            parseDocument();
        }
    });

}(window.$, window._));

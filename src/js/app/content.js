define([
    'app/base',
    'storage/blacklist',
    'view/content/panel',
    'parser/default'
], function(App, BlackListStorage, PanelView, Parser) {

    function _parseSpecialOffers(response) {
        var offers = [];
        _.each(response.vehicleInventoryGroups, function(vehicleInventoryGroup) {
            offers = _.union(offers, vehicleInventoryGroup.vehicleInventoryItems);
        });
        return offers;
    }

    function _fetchSpecialOffers(make, model, years, zip) {
        var deferred = new jQuery.Deferred();
        jQuery.ajax({
            url: [
                'http://www.edmunds.com/api/inventory/v1',
                make,
                model,
                'dealers/pp/list/'
            ].join('/'),
            data: {
                zip: zip,
                years: years.join(','),
                sortBy: 'distance'
            },
            dataType: 'json',
            success: function(response) {
                deferred.resolve({
                    make: make,
                    model: model,
                    years: years,
                    zip: zip,
                    offers: _parseSpecialOffers(response)
                });
            },
            error: function() {
                deferred.reject();
            }
        });
        return deferred.promise();
    }

    return App.extend({

        defaults: {
            parsingPeriod: 2000
        },

        initialize: function(options) {
            console.log('ContentApp#initialize');
            App.prototype.initialize.call(this, options);
            this.initializePanel();
            this.onDocumentChange = this.onDocumentChange.bind(this);
            this.parseDocument = _.throttle(this.parseDocument, options.parsingPeriod);
            BlackListStorage.get(function(items) {
                if (!_.contains(items, location.origin)) {
                    this.start();
                }
            }.bind(this));
        },

        initializePanel: function() {
            var view = this.panel = new PanelView({
                collapsed: this.options.collapsedPanel
            });
            view.on('close', this.stop, this);
            view.on('exclude', this.excludeUrl, this);
            view.on('collapse', this.dispatchCollapse, this);
            view.on('expand', this.dispatchExpand, this);
        },

        handleRuntimeMessage: function(message) {
            console.log('ContentApp#handleRuntimeMessage');
            switch (message.action) {
                case 'stop':
                    this.stop();
                    break;
                case 'start':
                    this.start();
                    break;
                case 'collapsePanel':
                    this.panel.collapse();
                    break;
                case 'expandPanel':
                    this.panel.expand();
                    break;
            }
        },

        onDocumentChange: function(event) {
            var $panelEl = this.panel.$el;
            if ($panelEl.is(event.target) || $panelEl.has(event.target).length > 0) {
                return;
            }
            this.parseDocument();
        },

        getDocumentContent: function() {
            return document.body.innerText.replace(this.panel.el.innerText, '');
        },

        parseDocument: function() {
            console.log('ContentApp#parseDocument');
            var documentContent = this.getDocumentContent();
            if (documentContent === this.previousDocumentContent) {
                return;
            }
            chrome.storage.local.get(['makeModelsMap', 'zip'], function(response) {
                var vehicles = Parser.parse(documentContent, response.makeModelsMap);
                this.fetchSpecialOffers(vehicles, response.zip);
            }.bind(this));
            this.previousDocumentContent = documentContent;
        },

        fetchSpecialOffers: function(vehicles, zip) {
            var requests = [];
            console.log('ContentApp#fetchSpecialOffers');
            _.each(vehicles, function(models, make) {
                _.each(models, function(years, model) {
                    requests.push(_fetchSpecialOffers(make, model, years, zip));
                });
            });
            return jQuery.when.apply({}, requests).done(function() {
                var args = [].slice.call(arguments),
                    offers = {},
                    offersCount = 0;
                _.each(args, function(data) {
                    if (data.offers.length === 0) {
                        return;
                    }
                    if (!offers[data.make]) {
                        offers[data.make] = {};
                    }
                    offers[data.make][data.model] = data.offers;
                    offersCount += data.offers.length;
                });
                if (offersCount === 0) {
                    this.panel.remove();
                } else {
                    this.panel.render();
                    this.panel.pricePromise.zip = zip;
                    this.panel.pricePromise.setSpecialOffers(offers, offersCount);
                    this.panel.setOffersCount(offersCount);
                }
            }.bind(this));
        },

        stop: function() {
            console.log('ContentApp#stop');
            document.removeEventListener('DOMSubtreeModified', this.onDocumentChange);
            this.panel.remove();
        },

        start: function() {
            console.log('ContentApp#start');
            document.addEventListener('DOMSubtreeModified', this.onDocumentChange);
            this.parseDocument();
        },

        excludeUrl: function(url) {
            console.log('ContentApp#exclude');
            BlackListStorage.add(url, function() {
                chrome.runtime.sendMessage({ action: 'stopContentApplications', data: url });
            });
        },

        dispatchCollapse: function() {
            chrome.storage.local.set({ collapsedPanel: true }, function() {
                chrome.runtime.sendMessage({ action: 'dispatchPanelEvent', data: 'collapsePanel' });
            });
        },

        dispatchExpand: function() {
            chrome.storage.local.set({ collapsedPanel: false }, function() {
                chrome.runtime.sendMessage({ action: 'dispatchPanelEvent', data: 'expandPanel' });
            });
        }

    });

});

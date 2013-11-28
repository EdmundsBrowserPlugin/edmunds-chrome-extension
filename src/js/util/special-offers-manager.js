define([], function() {

    return {

        parseSpecialOffers: function(response) {
            var offers = [];
            _.each(response.vehicleInventoryGroups, function(vehicleInventoryGroup) {
                offers = _.union(offers, vehicleInventoryGroup.vehicleInventoryItems);
            });
            return offers;
        },

        fetchSpecialOffers: function(make, model, years, zip) {
            var deferred = new jQuery.Deferred(),
                parseSpecialOffers = this.parseSpecialOffers;
            deferred.notify('fetching...');
            $.ajax({
                url: [
                    'http://www.edmunds.com/api/inventory/v1',
                    make,
                    model,
                    'dealers/newused/list/'
                ].join('/'),
                data: {
                    zip: zip,
                    years: years,
                    groupItemsSize: 1,
                    pageSize: 3
                },
                dataType: 'json',
                success: function(response) {
                    deferred.resolve({
                        make: make,
                        model: model,
                        years: years,
                        offers: parseSpecialOffers(response)
                    });
                },
                error: function() {
                    deferred.reject();
                }
            });
            return deferred.promise();
        }

    };

});

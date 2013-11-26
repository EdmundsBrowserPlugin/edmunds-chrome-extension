require([
    'app/Background',
    'util/request',
    'util/storage'
], function(BackgroundApp, request, storage) {

    var setup = new jQuery.Deferred();

    function checkForUpdates() {
        storage.getLastUpdatedDate(function(response) {
            var millisecondsInDay = 30 * 24 * 60 * 60 * 1000,
                updatePeriod = 30;
            if (typeof response.date !== 'number') {
                loadPredefinedMakeModels();
            } else if ((Date.now() - response.date) > updatePeriod * millisecondsInDay) {
                updateMakeModels();
            } else {
                setup.resolve();
            }
        });
    }

    function loadPredefinedMakeModels() {
        console.log('Loading predefined data...');
        request.getJSON('data/make-models.json', function(makeModels) {
            storage.setMakeModels(makeModels, function() {
                console.log('Predefined data was loaded.');
                setup.resolve();
            });
        });
    }

    function updateMakeModels() {
        console.log('Updating data...');
        setup.resolve();
    }

    setup.done(function() {
        /* jshint unused:false */
        var app = new BackgroundApp();
    });

    checkForUpdates();

});

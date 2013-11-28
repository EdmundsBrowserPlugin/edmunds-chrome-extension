require([
    'app/Background',
    'util/request',
    'util/storage'
], function(BackgroundApp, request, storage) {

    var setup = new jQuery.Deferred(),
        defaultZip = 90401;

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
                // temporary set default zip and then resolve
                storage.set({ zip: defaultZip }, function() {
                    setup.resolve();
                });
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
        app.zip = defaultZip;
    });

    checkForUpdates();

});

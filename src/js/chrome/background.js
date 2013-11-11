require([
    'parser/default',
    'util/deferred',
    'util/request',
    'util/storage'
], function(DefaultParser, Deferred, request, storage) {

    var init = new Deferred();

    function start() {
        chrome.runtime.onMessage.addListener(function(message, sender) {
            if (message.action === 'parseDocument' && sender.url) {
                console.log('Parsing ' + sender.url + '...');
                var startTime = Date.now();
                storage.getMakeModels(function(response) {
                    var vehicles = DefaultParser.parse(message.data, response.makeModels);
                    if (sender.tab) {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            action: 'updateVehicles',
                            data: vehicles
                        });
                    }
                    console.log('\t' + [
                        'length: ' + message.data.length,
                        'time: ' + ((Date.now() - startTime) / 1000) + 's'
                    ].join('\n\t'));
                });
            }
        });
    }

    function loadPredefinedMakeModels() {
        console.log('Loading predefined data...');
        request.getJSON('data/make-models.json', function(makeModels) {
            storage.setMakeModels(makeModels, function() {
                console.log('Predefined data was loaded.');
                init.resolve();
            });
        });
    }

    function updateMakeModels() {
        console.log('Updating data...');
        init.resolve();
    }

    function checkForUpdates() {
        storage.getLastUpdatedDate(function(response) {
            var millisecondsInDay = 30 * 24 * 60 * 60 * 1000,
                updatePeriod = 30;
            if (typeof response.date !== 'number') {
                loadPredefinedMakeModels();
            } else if ((Date.now() - response.date) > updatePeriod * millisecondsInDay) {
                updateMakeModels();
            } else {
                init.resolve();
            }
        });
    }

    init.done(start);

    checkForUpdates();

});

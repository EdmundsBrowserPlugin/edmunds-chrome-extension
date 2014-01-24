(function() {

    var defaults = {
        zip: 90401,
        collapsedPanel: false,
        blackList: []
    };

    function showSettingsPage() {
        var url = chrome.runtime.getURL('/options.html');
        chrome.tabs.query({ url: url }, function(tabs) {
            if (tabs.length !== 0) {
                tabs.forEach(function(tab) {
                    chrome.tabs.update(tab.id, { active: true });
                });
            } else {
                chrome.tabs.create({ url: url });
            }
        });
    }

    function showWelcomeNotification() {
        chrome.notifications.create('', {
            type: 'basic',
            title: chrome.i18n.getMessage('notification_welcome_title'),
            message: chrome.i18n.getMessage('notification_welcome_message'),
            iconUrl: 'img/icon/128.png',
            buttons: [{
                title: chrome.i18n.getMessage('notification_welcome_settings_button_title')
            }]
        }, function(welcomeNotificationId) {
            chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
                if (welcomeNotificationId === notificationId && buttonIndex === 0) {
                    showSettingsPage();
                }
            });
        });
    }

    function findZipCodeByCoordinates(coords, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://www.edmunds.com/api/region/regionservice/findzipdmabylatlong?fmt=json&latitude=' + coords.latitude + '&longitude=' + coords.longitude);
        xhr.onreadystatechange = function() {
            var json;
            if (xhr.readyState === 4) {
                try {
                    json = JSON.parse(xhr.responseText);
                } catch(e) {}
                callback(json);
            }
        };
        xhr.send(null);
    }

    function onZipFound(response) {
        if (response && response.zip) {
            defaults.zip = response.zip;
        }
        initializeLocalStorage();
    }

    function onPositionSuccess(geoposition) {
        findZipCodeByCoordinates(geoposition.coords, onZipFound);
    }

    function getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            var json;
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    json = JSON.parse(xhr.responseText);
                } catch(e) {}
                callback(json);
            }
        };
        xhr.send(null);
    }

    function initializeLocalStorage() {
        var urlMakeModelMap = chrome.runtime.getURL('/data/make-models.json'),
            urlModelAliasMap = chrome.runtime.getURL('/data/model-alias-map.json');
        getJSON(urlMakeModelMap, function(makeModelMap) {
            getJSON(urlModelAliasMap, function(modelAliasMap) {
                defaults.makeModelMap = makeModelMap;
                defaults.modelAliasMap = modelAliasMap;
                chrome.storage.local.set(defaults, function() {
                    showWelcomeNotification();
                });
            });
        });
    }

    chrome.runtime.onInstalled.addListener(function() {
        navigator.geolocation.getCurrentPosition(onPositionSuccess, initializeLocalStorage);
    });

}());

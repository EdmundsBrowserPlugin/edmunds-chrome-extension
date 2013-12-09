(function() {

    var defaults = {
        zip: 90401,
        blackList: [
            'http://developer.chrome.com',
            'https://github.com'
        ]
    };

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
                    chrome.tabs.create({
                        url: chrome.runtime.getURL('/options.html')
                    });
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

    function initializeLocalStorage() {
        chrome.storage.local.set(defaults, function() {
            showWelcomeNotification();
        });
    }

    chrome.runtime.onInstalled.addListener(function() {
        navigator.geolocation.getCurrentPosition(onPositionSuccess, initializeLocalStorage);
    });

}());

define([
    'util/deferred'
], function(Deferred) {

    var baseUrl = chrome.extension.getURL('');

    return {

        getJSON: function(url, callback) {
            var xhr = new XMLHttpRequest(),
                deferred = new Deferred();
            deferred.done(callback);
            xhr.open('GET', baseUrl + url);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    deferred.resolve(JSON.parse(xhr.responseText));
                }
            };
            xhr.send(null);
            return deferred.promise();
        }

    };

});

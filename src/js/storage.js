define([
    'util/deferred'
], function(Deferred) {

    var storage = chrome.storage.local;

    function _set(items, callback) {
        var deferred = new Deferred();
        deferred.done(callback);
        storage.set(items, function() {
            deferred.resolve();
        });
        return deferred.promise();
    }

    function _get(keys, callback) {
        var deferred = new Deferred();
        deferred.done(callback);
        storage.get(keys, function(value) {
            deferred.resolve(value);
        });
        return deferred.promise();
    }

    return {

        /**
         * An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will
         * not be affected.
         *
         * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function"
         * will typically serialize to {}, with the exception of Array (serializes as expected), Date,
         * and Regex (serialize using their String representation).
         *
         * @param {Object} items String or array of string or object keys
         * @returns {promise}
         */
        set: _set,

        /**
         * A single key to get, list of keys to get, or a dictionary specifying default values (see description of the
         * object). An empty list or object will return an empty result object. Pass in null to get the entire contents
         * of storage.
         *
         * @param {String, Array} keys String or array of string or object keys
         * @returns {promise}
         */
        get: _get,

        /**
         * @param {Object} makeModels
         * @param {Function} callback
         * @returns {promise}
         */
        setMakeModels: function(makeModels, callback) {
            return _set({
                makeModels: makeModels,
                lastUpdated: Date.now()
            }, callback);
        },

        /**
         * @param {Function} callback
         * @returns {promise}
         */
        getMakeModels: function(callback) {
            return _get('makeModels', callback);
        },

        getLastUpdatedDate: function(callback) {
            return _get('lastUpdated', callback);
        }

    };

});

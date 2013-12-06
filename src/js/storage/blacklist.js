/**
 * @class BlackListStorage
 * @static
 */
define(function() {

    var
        /**
         * @private
         * @property _storage
         * @type {StorageArea}
         */
        _storage = chrome.storage.local,

        /**
         * @private
         * @property _storageKey
         * @type {String}
         */
        _storageKey = 'blackList';

    /**
     * Gets the black list items.
     * @private
     * @async
     * @method _get
     * @param {Function} callback
     *     @param {Array} callback.items
     */
    function _get(callback) {
        _storage.get(_storageKey, function(response) {
            if (typeof callback === 'function') {
                callback(response[_storageKey] || []);
            }
        });
    }

    /**
     * Sets the black list items.
     * @private
     * @async
     * @method _set
     * @param {Array} list
     * @param {Function} callback
     */
    function _set(list, callback) {
        var items = {};
        items[_storageKey] = list;
        _storage.set(items, callback);
    }

    /**
     * @private
     * @method _contains
     * @param {Array} list
     * @param {String} item
     * @return {Boolean}
     */
    function _contains(list, item) {
        return list.indexOf(item) !== -1;
    }

    /**
     * @private
     * @method _without
     * @param {Array} list
     * @param {String} item
     * @return {Array}
     */
    function _without(list, item) {
        return list.filter(function(listItem) {
            return listItem !== item;
        });
    }

    /**
     * @private
     * @method _isFunction
     * @param {any} obj
     * @return {Boolean}
     */
    function _isFunction(obj) {
        return typeof obj === 'function';
    }

    return {

        /**
         * Adds an item to the black list.
         * @async
         * @method add
         * @param {String} item
         * @param {Function} [callback]
         *     @param {Array} callback.items
         *     @param {String} callback.addedItem
         */
        add: function(item, callback) {
            _get(function(list) {
                if (!_contains(list, item)) {
                    list.push(item);
                    _set(list, function() {
                        if (_isFunction(callback)) {
                            callback(list, item);
                        }
                    });
                }
            });
        },

        /**
         * Clears the black list.
         * @async
         * @method clear
         * @param {Function} [callback]
         */
        clear: function(callback) {
            _set([], callback);
        },

        /**
         * Gets the black list items.
         * @async
         * @method get
         * @param {Function} callback
         *     @param {Array} callback.items
         */
        get: _get,

        /**
         * Removes an item from the black list.
         * @async
         * @method remove
         * @param {String} item
         * @param {Function} [callback]
         *     @param {Array} callback.items
         *     @param {String} callback.removedItem
         */
        remove: function(item, callback) {
            _get(function(list) {
                if (_contains(list, item)) {
                    list = _without(list, item);
                    _set(list, function() {
                        if (_isFunction(callback)) {
                            callback(list, item);
                        }
                    });
                }
            });
        },

        /**
         * Fired when items change.
         * @method onChange
         * @param {Function} callback
         *     @param {Array} callback.newItems
         *     @param {Array} callback.oldItems
         */
        onChange: function(callback) {
            if (!_isFunction(callback)) {
                return;
            }
            chrome.storage.onChanged.addListener(function(changes, areaName) {
                var change = changes[_storageKey];
                if (areaName === 'local' && change) {
                    callback(change.newValue || [], change.oldValue || []);
                }
            });
        }

    };

});

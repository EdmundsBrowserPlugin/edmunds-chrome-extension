define([], function() {

    var hasOwn = [].hasOwnProperty;

    function BaseApp() {
        this.initialize.apply(this, arguments);
    }

    BaseApp.prototype = {

        /**
         * @method initialize
         * @chainable
         */
        initialize: function() {
            console.log('BaseApp#initialize');
            chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
            return this;
        },

        onMessage: function() {},

        sendAction: function(name, data) {
            console.log('BaseApp#sendAction');
            chrome.runtime.sendMessage({
                action: name,
                data: data
            });
            return this;
        },

        trackEvent: function(event) {
            console.log('BaseApp#trackEvent');
            this.sendAction('trackEvent', event);
        }

    };

    /**
     * @method extend
     * @static
     */
    BaseApp.extend = function(protoProperties, staticProperties) {
        var parent = this,
            child, Surrogate;
        // create constructor for the new subclass
        if (protoProperties && hasOwn.call(protoProperties, 'constructor')) {
            child = protoProperties.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }
        // add static properties
        _.extend(child, parent, staticProperties);
        // inherit from Parent
        Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        // add prototype properties to the Child
        if (protoProperties) {
            _.extend(child.prototype, protoProperties);
        }
        return child;
    };

    return BaseApp;

});

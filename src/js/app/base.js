define(function() {

    function App(options) {
        this.options = _.defaults(options || {}, this.defaults);
        this.initialize.call(this, this.options);
    }

    App.prototype = {

        defaults: {},

        initialize: function() {
            console.log('BaseApp#initialize');
            chrome.runtime.onMessage.addListener(this.handleRuntimeMessage.bind(this));
        },

        handleRuntimeMessage: function() {
            console.log('BaseApp#handleRuntimeMessage');
        }

    };

    App.extend = function(protoProperties, staticProperties) {
        var parent = this,
            child, Surrogate;
        // create constructor for the new subclass
        if (protoProperties && _.has(protoProperties, 'constructor')) {
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

    return App;

});

define(['google-analytics'], function(ga) {

    ga.push(['_setAccount', 'UA-47751302-1']);
    ga.push(['_trackPageview']);

    return {

        /**
         * @method track
         * @param {String} category
         * @param {String} action
         * @param {String} [label]
         * @param {Number} [value]
         * @chainable
         */
        track: function(category, action, label, value) {
            ga.push(['_trackEvent', category, action, label, value]);
            return this;
        }

    };

});

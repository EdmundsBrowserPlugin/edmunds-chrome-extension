define(['google-analytics'], function(ga) {

    ga.push(['_setAccount', 'UA-46028925-1']);

    if (location.origin + '/' === chrome.runtime.getURL('')) {
        ga.push(['_trackPageview']);
    }

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
            console.log([
                'analytics#track',
                'Category: ' + (category || ''),
                'Action: ' + (action || ''),
                'Label: ' + (label || ''),
                'Value: ' + (value || '')
            ].join('\n\t'));
            return this;
        }

    };

});

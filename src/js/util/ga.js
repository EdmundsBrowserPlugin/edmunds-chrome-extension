define(['google-analytics'], function(ga) {

    return {

        setAccount: function(accountId) {
            console.log('GA#setAccount');
            ga.push(['_setAccount', accountId]);
            return this;
        },

        trackPageView: function() {
            console.log('GA#trackPageView');
            ga.push(['_trackPageview']);
            return this;
        },

        /**
         * @param category The general event category.
         * @param action The action for the event.
         * @param [label] An optional descriptor for the event.
         * @param [value] An optional value associated with the event.
         * @returns {*}
         */
        trackEvent: function(category, action, label, value) {
            console.log([
                'GA#trackEvent',
                'Category: ' + (category || ''),
                'Action: ' + (action || ''),
                'Label: ' + (label || ''),
                'Value: ' + (value || '')
            ].join('\n\t'));
            ga.push(['_trackEvent', category, action, label, value]);
            return this;
        }

    };

});

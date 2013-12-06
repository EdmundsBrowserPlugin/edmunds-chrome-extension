define(['google-analytics'], function(ga) {

    ga.push(['_setAccount', 'UA-46028925-1']);
    ga.push(['_trackPageview']);

    return {

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

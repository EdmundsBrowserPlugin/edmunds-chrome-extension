define([], function() {

    _.mixin({

        formatNumber: function(value) {
            return (Number(value) || 0).toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(',');
        }

    });

});

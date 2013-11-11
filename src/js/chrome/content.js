require([
    'app/Content'
], function(ContentApp) {

    var app = new ContentApp();
    app.createVehiclesPanel();
    app.parseDocument();

});

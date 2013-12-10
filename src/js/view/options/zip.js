define([
    'analytics/ga'
], function(analytics) {

    return Backbone.View.extend({

        el: $('#zip-code-section'),

        events: {
            'click [data-action="change"]': 'onChange',
            'click [data-action="update"]': 'onUpdate',
            'keypress input[type="text"]': 'onKeypress'
        },

        initialize: function() {
            this.hideUpdateSection();
            chrome.storage.local.get('zip', function(response) {
                this.displayZip(response.zip);
                this.currentZipCode = response.zip;
            }.bind(this));
        },

        showUpdateSection: function() {
            this.$('#showzip').addClass('hidden');
            this.$('#updatezip').removeClass('hidden');
        },

        hideUpdateSection: function() {
            this.$('#showzip').removeClass('hidden');
            this.$('#updatezip').addClass('hidden');
        },

        showError: function() {
            this.$('#zip-validation-error').removeClass('hidden');
        },

        hideError: function() {
            this.$('#zip-validation-error').addClass('hidden');
        },

        validateZip: function(zip) {
            var deferred = new $.Deferred();
            $.ajax({
                url: 'http://www.edmunds.com/api/region/zip/validation/' + zip,
                data: {
                    fmt: 'json'
                },
                dataType: 'json',
                success: function(response) {
                    var isValid = response[zip] === 'true';
                    deferred[isValid ? 'resolve' : 'reject'](zip, isValid);
                },
                error: function() {
                    deferred.reject(zip, false);
                }
            });
            return deferred.promise();
        },

        displayZip: function(zip) {
            this.$('#zip-input').val(zip);
            this.$('#zip-text').text(zip);
        },

        saveZip: function(zip) {
            chrome.storage.local.set({ zip: zip });
        },

        onChange: function() {
            this.showUpdateSection();
            this.currentZipCode = this.$('#zip-input').val();
            analytics.track('ZIP Settings', 'Click', 'Change button');
        },

        onUpdate: function() {
            var zip = this.$('#zip-input').val();
            analytics.track('ZIP Settings', 'Click', 'Update button');
            if (zip === this.currentZipCode) {
                this.hideUpdateSection();
                return;
            }
            if (!/\d{5}/.test(zip)) {
                this.showError();
                return;
            }
            this.validateZip(zip)
                .done(function() {
                    this.saveZip(zip);
                    this.displayZip(zip);
                    this.hideError();
                    this.hideUpdateSection();
                }.bind(this))
                .fail(function() {
                    this.showError('Please enter a valid ZIP code');
                }.bind(this));
        },

        onKeypress: function(event) {
            var key = String.fromCharCode(event.charCode);
            if (!/\d/.test(key)) {
                event.preventDefault();
            }
        }

    });

});

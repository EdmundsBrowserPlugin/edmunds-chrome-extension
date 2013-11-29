(function($) {

    var zipInput = document.getElementById('zip-input'),
        zipChangeButton = document.getElementById('zip-change-btn'),
        zipUpdateButton = document.getElementById('zip-update-btn'),
        zipValidationError = $('#zip-validation-error'),
        currentZipCode;

    function validateZip(zip) {
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
    }

    function displayZip(zip) {
        zipInput.value = zip;
        document.getElementById('zip-text').innerText = zip;
    }

    function saveZip(zip) {
        // save settings
        chrome.storage.local.set({ zip: zip });
        // update content scripts
        chrome.runtime.sendMessage({
            action: 'setZip',
            data: zip
        });
    }

    function showError(message) {
        zipValidationError.removeClass('hidden').text(message);
    }

    function hideError() {
        zipValidationError.addClass('hidden').text('');
    }

    function init() {
        document.getElementById('showzip').style.display = '';
        document.getElementById('updatezip').style.display = 'none';
        chrome.storage.local.get('zip', function(response) {
            displayZip(response.zip);
            currentZipCode = response.zip;
        });
    }

    zipInput.addEventListener('keypress', function(event) {
        var key = String.fromCharCode(event.charCode);
        if (!/\d/.test(key)) {
            event.preventDefault();
        }
    });

    zipChangeButton.addEventListener('click', function() {
        document.getElementById('showzip').style.display = 'none';
        document.getElementById('updatezip').style.display = '';
        currentZipCode = zipInput.value;
    });

    zipUpdateButton.addEventListener('click', function() {
        var zip = zipInput.value;
        if (zip === currentZipCode) {
            document.getElementById('showzip').style.display = '';
            document.getElementById('updatezip').style.display = 'none';
            return;
        }
        if (!/\d{5}/.test(zip)) {
            showError('Please enter a valid ZIP code');
            return;
        }
        validateZip(zip)
            .done(function() {
                saveZip(zip);
                displayZip(zip);
                hideError();
                document.getElementById('showzip').style.display = '';
                document.getElementById('updatezip').style.display = 'none';
            })
            .fail(function() {
                showError('Please enter a valid ZIP code');
            });
    });

    init();

}(window.jQuery));

navigator.geolocation.getCurrentPosition(function() {console.log(arguments)});

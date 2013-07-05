var app = angular.module('plunker', ['angular-google-analytics']);

app.config(function(AnalyticsProvider) {
        // initial configuration
        AnalyticsProvider.setAccount('UA-42244666-1');

        // track all routes (or not)
        AnalyticsProvider.trackPages(true);

        // url prefix (default is empty)
        // - for example: when an app doesn't run in the root directory
        AnalyticsProvider.trackPrefix('anttihavanko.github.io');
    });
	
app.controller('MenuCtrl', function($rootScope, $scope, Analytics) {
        Analytics.trackTrans();
	});
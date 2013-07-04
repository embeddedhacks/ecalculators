
app.config(function($routeProvider) {
    $routeProvider.
      when('/VoltageDivider', {controller:'VoltageDividerCtrl', templateUrl:'calculators/voltagedivider.tpl.html'}).
      when('/LedResistor', {controller:'LedResistorCtrl', templateUrl:'calculators/ledresistor.tpl.html'}).
      when('/ClosestResistor', {controller:'ClosestResistorCtrl', templateUrl:'calculators/closestresistor.tpl.html'}).
      otherwise({redirectTo:'/VoltageDivider'});
  });
  
app
	.controller('VoltageDividerCtrl', function() {
		
	})
	.controller('ClosestResistorCtrl', function() {
		
	})
	.controller('LedResistorCtrl', function() {
		
	});
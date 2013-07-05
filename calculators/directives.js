
app.directive('voltagedivider', function($filter, $timeout) {
	return {
		restrict: 'A',
		templateUrl: 'calculators/directives/voltagedivider.tpl.html',
		scope: true,
		link: function(scope, element, attributes, model) {
		
			var changed = '';
      var disableVoutEvent = false;
      
      scope.logs = [];
      
      var timeoutHandle;
      
      var onChangeEvent = function() {
        if(timeoutHandle) $timeout.cancel(timeoutHandle);
        
        timeoutHandle = $timeout(function() {
          calculateValues();
        }, 500);
      }
      var calculateValues = function() {
        var vin = parseFloat(scope.vin);
        var r1 = parseFloat(scope.r1);
        var r2 = parseFloat(scope.r2);
        var vout = parseFloat(scope.vout);
        
        
        if(changed == 'vout') {
          if(!vin || !vout || !r2)
            return;
          disableVoutEvent = true;
        
          r1 = (vin * r2) / vout - r2;
          scope.r1 = r1;
        }
        else {
          if(!vin || !r1 || !r2)
            return;
          disableVoutEvent = true;
          
          vout = (vin * r2) / (r1 + r2);
          scope.vout = vout;
        }
        
        scope.logs.push({
          date : new Date(),
          vin : vin,
          r1 : r1,
          r2 : r2,
          vout : vout
        });
      };
      
      scope.$watch('vin', function(value) {
        changed = 'vin';
        onChangeEvent();
      });
      scope.$watch('r1', function(value) {
        if(disableVoutEvent) {
          disableVoutEvent = false;
          return;
        }
        changed = 'r1';
        onChangeEvent();
      });
      scope.$watch('r2', function(value) {
        changed = 'vin';
        onChangeEvent();
      });
      scope.$watch('vout', function(value) {
        if(disableVoutEvent) {
          disableVoutEvent = false;
          return;
        }
        changed = 'vout';
        onChangeEvent();
      });
		}
	};
});

app.directive('ledresistor', function($filter, $timeout) {
  return {
		restrict: 'A',
		templateUrl: 'calculators/directives/ledresistor.tpl.html',
    scope: true,
		link: function(scope, element, attributes, model) {
      var changed = '';
      var disableVoutEvent = false;
      
      scope.logs = [];
      
      var timeoutHandle;
      
      var onChangeEvent = function() {
        if(timeoutHandle) $timeout.cancel(timeoutHandle);
        
        timeoutHandle = $timeout(function() {
          calculateValues();
        }, 500);
      };
      
      var calculateValues = function() {
        var vin = parseFloat(scope.vin);
        var led = parseFloat(scope.led);
        var current = parseFloat(scope.current);
        var r1 = parseFloat(scope.r1); 
        var r1W = null;
        
        
        if(changed == 'r1') {
          if(!vin || !led || !r1)
            return;
          disableVoutEvent = true;
          
          current = (vin - led)*1000 / (r1);
          scope.current = current;
        }
        else {
          if(!vin || !led || !current)
            return;
          disableVoutEvent = true;
          
          r1 = (vin - led)*1000 / (current);
          scope.r1 = r1;
        }
        
        r1W = r1 * (current * current) / 1000;
        scope.r1W = r1W;
        
        scope.logs.push({
          date : new Date(),
          vin : vin,
          led : led,
          current : current,
          r1 : r1,
          r1W : r1W
        });
      };
      
      scope.$watch('vin', function(value) {
        changed = 'vin';
        onChangeEvent();
      });
      scope.$watch('led', function(value) {
        changed = 'led';
        onChangeEvent();
      });
      scope.$watch('current', function(value) {
        if(disableVoutEvent) {
          disableVoutEvent = false;
          return;
        }
        changed = 'current';
        onChangeEvent();
      });
      scope.$watch('r1', function(value) {
        if(disableVoutEvent) {
          disableVoutEvent = false;
          return;
        }
        changed = 'r1';
        onChangeEvent();
      });
    }
  };
});

app.directive('closestresistor', function($filter, $timeout) {
  return {
    restrict: 'A',
		templateUrl: 'calculators/directives/closestresistor.tpl.html',
    scope: true,
		link: function(scope, element, attributes, model) {
		scope.series = 12;
      
      var factors = [1, 10, 100];
      var e12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10.0];
      var e24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10.0];
      
      var timeoutHandle;
      var onChangeEvent = function() {
        if(timeoutHandle) $timeout.cancel(timeoutHandle);
        
        timeoutHandle = $timeout(function() {
          calculateValues();
        }, 500);
      };
      
      var getValues = function(value1, value2) {
        var values = [];
        angular.forEach(factors, function(factor1) {
          angular.forEach(factors, function(factor2) {
            var v1 = value1*factor1;
            var v2 = value2*factor2;
            
            //serial
            values.push( {
              value1 : v1,
              value2 : v2,
              isSerial : true,
              sum: v1 + v2
            });
            
            //parallel
            values.push( {
              value1 : v1,
              value2 : v2,
              isSerial : false,
              sum: 1/(1/v1 + 1/v2)
            });
          });
        });
        return values;
      };
      
      var calculateValues = function() {
        var r1 = parseFloat(scope.r1);
        
        if(!r1) return;
        
        scope.foundValues = [];
        var arr = [];
        
		var resValues = (scope.series == 24)? e24 : e12;
		
        //go throught all possible values
        angular.forEach(resValues, function(value1) {
          angular.forEach(resValues, function(value2) {
            var sum = value1 + value2;
            var values = getValues(value1, value2);
            
            //check each value
            angular.forEach(values, function(v1) {
              var diff = Math.abs(v1.sum - r1);
              var diffPercent = diff / r1 * 100;
              
              if(diffPercent < 1) {
                arr.push({
                  values : v1,
                  diff : diff,
                  diffPercent : diffPercent
                });
              }
            });
          });
        });
        
        scope.foundValues = arr;
      };
      
      scope.$watch('r1', function(value) {
        onChangeEvent();
      });
      scope.$watch('series', function(value) {
        onChangeEvent();
      });
    }
  };
});


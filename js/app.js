(function () {
  'use strict';

  angular.module('karl', []);

  /**
    Focus Factory
   */
  angular.module('karl')
    .factory('focus', function($timeout, $window) {
      return function(id) {
        $timeout(function() {
          var element = $window.document.getElementById(id);
          if(element) {
            element.focus();
            //console.log('FOCUSED');
          }
        });
      };
    });

  /**
    Services
   */
  angular.module('karl').service('input',     ["$sce", input]);
  //angular.module('karl').service('execute',   ["$sce", "ls", input]);
  angular.module('karl').service('pwd',       ["$sce", "input", pwd]);
  angular.module('karl').service('ls',        ["$sce", "input", "pwd", ls]);
  angular.module('karl').service('cd',        ["$sce", "input", "pwd", "ls", cd]);
  angular.module('karl').service('cat',       ["$sce", "$http", "input", "pwd", "ls", cat]);

  angular.module('karl').service('terminal',  ["$sce", "input", "cat", "ls", "cd", "pwd", terminal]);

  /**
    Controller
   */ 
  angular.module('karl')
    .controller("karlCtrl", ["$scope", "$http", "focus", "$sce", "terminal", "pwd", karlController]);
  
})();

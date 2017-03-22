
(function () {
  'use strict';

  angular.module('karl', []);

  angular.module('karl')
    .config(function($locationProvider) {
      //$locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
      $locationProvider.html5Mode({ enabled: true });
    });

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
            //console.log('focus');
          }
        });
      };
    });

  /**
    Services
   */
  angular.module('karl').service('input',     ["$sce", input]);
  angular.module('karl').service('output',    ["$sce", output]);
  angular.module('karl').service('pwd',       ["$sce", "input", pwd]);
  angular.module('karl').service('ls',        ["$sce", "input", "pwd", ls]);
  angular.module('karl').service('cd',        ["$sce", "input", "output", "pwd", "ls", "$window", cd]);
  angular.module('karl').service('cat',       ["$sce", "$http", "input", "output", "pwd", "ls", cat]);
  angular.module('karl').service('tab',       ["$sce", "output", "pwd", "ls", tab]);
  angular.module('karl').service('terminal',  ["$sce", "input", "cat", "ls", "cd", "pwd", terminal]);

  /**
    Controller
   */
  angular.module('karl')
    .controller("karlCtrl", ["$scope", "$http", "focus", "$sce", "terminal", "cd", "pwd", "ls", "output", "tab", "$window", "$timeout", karlController]);
  
})();

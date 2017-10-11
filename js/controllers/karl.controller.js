/*
                                _____
                               | ░ ░ |
                              _| ░░░ |_
                      .-.--.-| .     . |-.--.-.
                      '-'--'-|    -||- |-'--'-'
                             | .   | . |
                             |_________| 
                              |__| |__|
                              |__| |__|
                              |__| |__|
                              |__| |__|
*/

function karlController ($scope, $http, focus, $sce, terminal, cd, pwd, ls, output, tab, $window, $timeout) {
 
  console.log('Hi there ;)');

  var vm = this;
  vm.hideCarrot = true;
  vm.originalText = '';
  vm.cloneText = '';
  vm.cursorStyle = { left: 0 };

  output.output = [
    //{plain: true, text: $sce.trustAsHtml("<pre>                _____            </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>               | ░ ░ |           </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>              _| ░░░ |_          </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>      .-.--.-| .     . |-.--.-.  </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>      '-'--'-|    -||- |-'--'-'  </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>             | .   | . |         </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>             |_________|         </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>              |__| |__|          </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>              |__| |__|          </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>              |__| |__|          </pre>")},
    //{plain: true, text: $sce.trustAsHtml("<pre>              |__| |__|          </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>   _  __          _    _____ _       _ _                         _     _ </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>  | |/ /         | |  / ____| |     | | |                       | |   | |</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>  | ' / __ _ _ __| | | (___ | |_ ___| | |_ ___ _ __  _ __   ___ | |__ | |</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>  |  < / _` | '__| |  \\___ \\| __/ _ \\ | __/ _ \\ '_ \\| '_ \\ / _ \\| '_ \\| |  </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>  | . \\ (_| | |  | |  ____) | ||  __/ | ||  __/ | | | |_) | (_) | | | | |</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>  |_|\\_\\__,_|_|  |_| |_____/ \\__\\___|_|\\__\\___|_| |_| .__/ \\___/|_| |_|_|</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre>                                                    | |            v1.1.7</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Hacker                                         |_|</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Sr Frontend @ Oranj</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Semi-Pro Foosball Player")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Daytrader w/ Machine Learning</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Artist</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Musician/Producer</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class=''>     Sailor</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre class='pink'>     Type \"help\"...</pre>")},
    {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
  ];
  vm.location = '';
  vm.pwdString = '';
  vm.background = cd.defaultBg;
  
  var historyPosition = 0;
  var lastKeyCode = 0;

  // output watcher
  (function () {
      $scope.$watch(function () {
          return output.output;
      }, function (newVal, oldVal) {
        vm.output = newVal;
      });
  }());

  // Background watcher
  (function () {
      $scope.$watch(function () {
          return output.background;
      }, function (newVal, oldVal) {
        console.log('bg watcher', newVal, oldVal);
        if(newVal != oldVal) {
          vm.background = newVal;
        }
      });
  }());

  vm.focusTerminal = function () {

    focus('setter');
  };

  vm.focus = function () {

    vm.hideCarrot = false;
  };

  vm.tabFocus = function () {
    vm.originalText = tab.tab(vm.originalText);
    $timeout(function() {
      var a = vm.originalText;
      vm.originalText = '';
      $timeout(function() {
        vm.originalText = a;
        vm.focusTerminal();
      },10); 
    },10);
  };

  vm.blur = function () {
    vm.hideCarrot = true;
    vm.focusTerminal();
  };

  function updateScroll() {
    var element = document.getElementById("terminal-wrapper");
    element.scrollTop = element.scrollHeight;
  }

  function nl2br(txt) { 
    if(angular.isDefined(txt)) {
      return txt.replace(/\n/g, "<br />");
    }
  }
  
  function writeIt(e) { 
    e = e || window.event;
    vm.cloneText = $sce.trustAsHtml(nl2br(vm.originalText));
  }

  function moveIt(e) { 
    e = e || window.event;
    var keycode = e.keyCode || e.which;
    var count = vm.originalText.length;
    var c = 8;
    //console.log('keycode', vm.cloneText.length, keycode);
    if(keycode == 37 && parseInt(vm.cursorStyle.left) >= (0-((count-1)*c))) { // if the key pressed by the user is left and the position of the cursor is greater than or equal to 0 - the number of words in the textarea - 1 * 10 then ...
      vm.cursorStyle.left = parseInt(vm.cursorStyle.left) - c + "px";
    } else if(keycode == 39 && (parseInt(vm.cursorStyle.left) + c) <= 0) { // otherwise, if the key pressed by the user if right then check if the position of the cursor + 10 is smaller than or equal to zero if it is then ...
      vm.cursorStyle.left = parseInt(vm.cursorStyle.left) + c + "px"; // move the "fake caret" to the right
    }
  }
  
  function submitIt(e) {
    e = e || window.event; /* window.event fix again */
    //updateScroll();
    var keycode = e.keyCode || e.which; /* keycode fix */
    if(keycode == 13 && vm.originalText != '') {
      output.output.push({ human: true, pwdString: pwd.current.join("/"), text: $sce.trustAsHtml(vm.originalText)});
      var response = terminal.handle(vm.originalText);
      
      // clear function happens here
      if(response === 'clear') {
        output.output = [
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
          {plain: true, text: $sce.trustAsHtml("<pre> </pre>")}
        ];
      }
      // push output onto output
      else if(response.length) {
        output.output = output.output.concat(response);
      } 
      // ...
      else {
        output.output = output.output;
      }

      vm.originalText = '';
      vm.pwdString = pwd.current.join("/");
    }

    //
    $timeout(function() {
      updateScroll();
    }, 150);
  }

  function history(e) {
    e = e || window.event; /* window.event fix again */
    var keycode = e.keyCode || e.which; /* keycode fix */
    if(keycode == 38 || keycode == 40) {

      var history = output.output.filter(function (item) {
        return angular.isDefined(item.human) && item.human == true;
      });

      if(lastKeyCode == 38 || lastKeyCode == 40) {
        if(keycode == 38 && historyPosition < history.length-1) {
          historyPosition++;
        } 
        else if(keycode == 40 && historyPosition > 0) {
          historyPosition--;
        } 
        else {
          historyPosition = 0;
        }
      }

      var historyValue = $sce.getTrustedHtml(history[history.length-1-historyPosition].text);
      vm.originalText = historyValue;
      
      // push to end of input 
      $timeout(function() {
        var a = vm.originalText;
        vm.originalText = '';
        $timeout(function() {
          vm.originalText = a;
        },10); 
      },10);
      
      lastKeyCode = keycode;
    }
  }
  
  vm.keydown = function (e, move) {
    if(move) {
      submitIt(e);
      history(e);
      moveIt(e);
    }
    writeIt(e);
  };

  vm.sketchParticles = function () {
    var MAX_PARTICLES = 280;
    var COLOURS = [ '#D68920', '#F1266F', '#54BDCA', '#4F4A98', '#D9BF58', '#CAECE6', '#8BC42A' ];

    var particles = [];
    var pool = [];

    var demo = Sketch.create({
        container: document.getElementById( 'container' ),
        retina: 'auto',
        fullscreen: false,
        width: 200,
        height: 200
    });

    demo.setup = function() {
      // Set off some initial particles.
      var i, x, y;

      for ( i = 0; i < 20; i++ ) {
          //x = ( demo.width * 0.5 ) + random( -100, 100 );
          //y = ( demo.height * 0.5 ) + random( -100, 100 );
          x = ( demo.width * 0.5 );
          y = ( demo.height * 0.5 );
          demo.spawn( x, y );
      }
    };

    demo.spawn = function( x, y ) {
        
        var particle, theta, force;

        if ( particles.length >= MAX_PARTICLES )
            pool.push( particles.shift() );

        particle = pool.length ? pool.pop() : new Particle();
        particle.init( x, y, random( 1, 4 ) );

        particle.wander = random( 0.5, 2.0 );
        particle.color = random( COLOURS );
        particle.drag = random( 0.9, 0.99 );

        theta = random( TWO_PI );
        force = random( 2, 8 );

        particle.vx = sin( theta ) * force;
        particle.vy = cos( theta ) * force;

        particles.push( particle );
    };

    demo.update = function() {

        var i, particle;

        for ( i = particles.length - 1; i >= 0; i-- ) {

            particle = particles[i];

            if ( particle.alive ) particle.move();
            else pool.push( particles.splice( i, 1 )[0] );
        }
    };

    demo.draw = function() {

        demo.globalCompositeOperation  = 'lighter';

        for ( var i = particles.length - 1; i >= 0; i-- ) {
            particles[i].draw( demo );
        }
    };

    demo.keydown = function() {

        var particle, theta, force, touch, max, i, j, n;
        var i, x, y;

        for ( i = 0; i < 5; i++ ) {
            //x = ( demo.width * 0.5 ) + random( -100, 100 );
            //y = ( demo.height * 0.5 ) + random( -100, 100 );
            x = ( demo.width * 0.5 );
            y = ( demo.height * 0.5 );
            demo.spawn( x, y );
        }
    };
  };

  function setBgState() {

    // loop until you
    // 


  }

  function setState () {
    var currentState = $window.history.state;
    var currentHash = $window.location.hash;
    var pwdString = currentHash.substring(1);
    pwdString = pwdString.replace(/^\/|\/$/g, '');
    if(pwdString != "") {
      if(pwdString.indexOf("/") > -1) {
        pwd.current = pwdString.split('/');
      } else {
        pwd.current = [pwdString];
      }
      vm.pwdString = pwdString;

      setBgState();
      console.log('currentState', currentState, currentHash, pwdString, vm.pwdString);
    }
  }

  function init() {
    focus('setter');
    vm.sketchParticles();
    setState();
  }

  init();
}

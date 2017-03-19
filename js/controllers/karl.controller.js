

  function karlController ($scope, $http, focus, $sce, terminal, pwd, output) {
   
    var vm = this;
    vm.hideCarrot = true;
    vm.originalText = '';
    vm.cloneText = '';
    vm.cursorStyle = { left: 0 };
    output.output = [
      {plain: true, text: $sce.trustAsHtml("<pre>   _  __          _    _____ _       _ _                         _     _ </pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre>  | |/ /         | |  / ____| |     | | |                       | |   | |</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre>  | ' / __ _ _ __| | | (___ | |_ ___| | |_ ___ _ __  _ __   ___ | |__ | |</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre>  |  < / _` | '__| |  \\___ \\| __/ _ \\ | __/ _ \\ '_ \\| '_ \\ / _ \\| '_ \\| |  </pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre>  | . \\ (_| | |  | |  ____) | ||  __/ | ||  __/ | | | |_) | (_) | | | | |</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre>  |_|\\_\\__,_|_|  |_| |_____/ \\__\\___|_|\\__\\___|_| |_| .__/ \\___/|_| |_|_|</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre>                                                    | |</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre class=''>       Hacker                                       |_|</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre class=''>       Semi-Pro Foosball Player")},
      {plain: true, text: $sce.trustAsHtml("<pre class=''>       Artist</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre class='pink'>       (Type help...)</pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre> </pre>")},
      {plain: true, text: $sce.trustAsHtml("<pre> </pre>")}
    ];
    vm.location = '';
    vm.pwdString = '';

    // watch output
    (function () {
        $scope.$watch(function () {
            return output.output;
        }, function (newVal, oldVal) {
          console.log('a',newVal,oldVal);
            //if ( newVal !== oldVal ) {
            //  console.log('')
                vm.output = newVal;
            //    console.log('watch!');
            //}
        });
    }());

    vm.focusText = function () {
      focus('setter');
    };

    vm.foucsTerminal = function () {
      focus('setter');
    };

    vm.focus = function () {
      //console.log('focus a');
      vm.hideCarrot = false;
    };

    vm.blur = function () {
      //console.log('blur a');
      vm.hideCarrot = true;
    };

    function updateScroll() {
      var element = document.getElementById("terminal-wrapper");
      element.scrollTop = element.scrollHeight;
    }

    /* helper, textarea return \n not <br /> */
    function nl2br(txt){ 
      if(angular.isDefined(txt)) {
        return txt.replace(/\n/g, "<br />");
      }
    }
    
    function writeIt(e) { 
      e = e || window.event; /* window.event fix for browser compatibility */
      vm.cloneText = $sce.trustAsHtml(nl2br(vm.originalText)); /* convert newlines to breaks and append the returned value to the content area */
    }

    function moveIt(e) { 
      e = e || window.event; /* window.event fix again */
      var keycode = e.keyCode || e.which; /* keycode fix */
      var count = vm.originalText.length;
      var c = 7.5;
      //console.log('keycode', vm.cloneText.length, keycode);
      if(keycode == 37 && parseInt(vm.cursorStyle.left) >= (0-((count-1)*c))) { // if the key pressed by the user is left and the position of the cursor is greater than or equal to 0 - the number of words in the textarea - 1 * 10 then ...
        vm.cursorStyle.left = parseInt(vm.cursorStyle.left) - c + "px";
      } else if(keycode == 39 && (parseInt(vm.cursorStyle.left) + c) <= 0) { // otherwise, if the key pressed by the user if right then check if the position of the cursor + 10 is smaller than or equal to zero if it is then ...
        vm.cursorStyle.left = parseInt(vm.cursorStyle.left) + c + "px"; // move the "fake caret" to the right
      }
    }
    
    /* the magic starts here, this function requires the element from which the value is extracted and an event object */
    function submitIt(e) {
      e = e || window.event; /* window.event fix again */
      updateScroll();
      var keycode = e.keyCode || e.which; /* keycode fix */
      if(keycode == 13 && vm.originalText != '') {
        output.output.push({ pwdString: pwd.current.join("/"), text: $sce.trustAsHtml(vm.originalText)});
        var response = terminal.handle(vm.originalText);
        console.log('terminal response', response);
        
        // clear function happens here
        if(response === 'clear') {
          output.output = [];
        }
        else if(response.length) {
          output.output = output.output.concat(response);
        } else {
          output.output = output.output;
        }

        vm.originalText = '';
        vm.pwdString = pwd.current.join("/");
        console.log(output.output);
      }
    }

    vm.keydown = function (e, move) {
      submitIt(e);
      writeIt(e);
      if(move) {
        moveIt(e);
      }
    };

    vm.sketchParticles = function () {
      var MAX_PARTICLES = 280;
      //var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
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

        //console.log("w",demo.width,"h",demo.height);

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
          particle.init( x, y, random( 1, 5 ) );

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

      /*demo.mousemove = function() {

          var particle, theta, force, touch, max, i, j, n;

          for ( i = 0, n = demo.touches.length; i < n; i++ ) {

              touch = demo.touches[i], max = random( 1, 4 );
              for ( j = 0; j < max; j++ ) {
                demo.spawn( touch.x, touch.y );
              }

          }
      };*/

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

    function init() {
      //console.log('karlController');
      focus('setter');
      vm.sketchParticles();
    }

    init();
  }


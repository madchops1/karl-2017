function cat ($sce, $http, input, pwd, ls) {
  
  this.output = [];
  this.target = "";

  this.cat = function () {

    console.log('cat', input.input[1]);
    this.target = input.input[1];
    // take the input, 
    // and match it against the directory structure
    // and then xhr the file contents and print them line by line to the screen
    // ... @todo

    this.loop(ls.directoryStructure,0);

    return this.output;
  };

  this.loop = function (obj, pathKey) {
    //console.log(this.target);
    for(var j=0; j<obj.length; j++) {
      //console.log('cat loop', pathKey, obj[j]);
      
      // more roots
      if(angular.isDefined(obj[j].children) && obj[j].children.length) {
        this.loop(obj[j].children,pathKey+1);
      } 
      // end of roots
      else {
        // check for a match
        if(obj[j].name == this.target && obj[j].executible === true) {
          console.log('cat match', obj[j]);

          // xhr the file contents
          // Simple GET request example:
          /*
          $http({
            method: 'GET',
            url: obj[j].path
          }).then(function successCallback(response) {
              console.log('success');
            }, function errorCallback(response) {
              console.log('error');
            });
          */

        }
      }
    }    
  };

}

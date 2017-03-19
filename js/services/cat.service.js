function cat ($sce, $http, input, output, pwd, ls) {
  
  m = this;
  this.target = "";
  this.current = [];

  this.cat = function () {
    this.target = input.input[1];
    this.targetArray =this.target.split("/");
    this.current = pwd.current;
    this.loop(ls.directoryStructure,0);
    return true;
  };

  this.loop = function (obj, pathKey) {

    for(var j=0; j<obj.length; j++) {
      console.log('cat loop', pathKey, obj[j]);
      
      // more roots, but only matched roots
      if(angular.isDefined(obj[j].children) && obj[j].children.length && this.current[pathKey] == obj[j].name ) {
        this.loop(obj[j].children,pathKey+1);
        break;
      } 
      // end of roots
      else {
        // check for a match
        if(obj[j].name == this.target) {
          console.log('cat match', obj[j]);

          if(obj[j].executible === true) {

            console.log('match is executible');

            $http({
              method: 'GET',
              url: obj[j].path
            }).then(function successCallback(response) {

                output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='white'>" + response.data + "</span>") });

              }, function errorCallback(response) {

                //console.log('error');
              });
          } 
          // not executible
          else {

            output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='pink'>Not an executible file.</span>") });

          }
          break;
        }
      }
    }    
  };

}

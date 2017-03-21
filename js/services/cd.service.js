
function cd($sce, input, output, pwd, ls, $window) {

  this.target = "";
  this.current = [];

  this.cd = function () {
    this.target = input.input[1].replace(/\/+$/, "");
    this.targetArray = this.target.split("/");
    this.current = pwd.current;
    this.combinedTarget = this.current.concat(this.targetArray);

    this.reverseLoop();
    this.combinedTargetLength = this.combinedTarget.length-1;

    this.loop(ls.directoryStructure, 0);
    return true;
  };

  this.reverseLoop = function () {
    var count = 0;
    for(var i=0; i<this.combinedTarget.length; i++) {
      if(this.combinedTarget[i] == '..') {
        this.combinedTarget.splice(i-1,1);
        this.combinedTarget.splice(i-1,1);
        i=i-1;
        i=i-1;
      }
    }
  };

  this.loop = function (obj, pathKey) {
    if(this.combinedTargetLength < 0 || this.combinedTarget[this.combinedTargetLength] == "") { 
      pwd.current = [];
      $window.history.pushState(null, 'Page Title', "/"+pwd.current.join('/'));
      return true; 
    }
    for(var j=0; j<obj.length; j++) {
     
      // if the name is a match
      if(pathKey == this.combinedTargetLength && (obj[j].name == this.target || obj[j].name == this.combinedTarget[this.combinedTargetLength])) {
        if(angular.isDefined(obj[j].children)) {
          pwd.current = this.combinedTarget;
          $window.history.pushState(null, 'Page Title', "/"+pwd.current.join('/'));
        } else {
          output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='pink'>Not a directory.</span>") });
        }
        break;
      } 

      // else if it is not a match but it is a directory that matches this pathKey
      else if(angular.isDefined(obj[j].children) && obj[j].children.length && (this.combinedTarget[pathKey] == obj[j].name)) {
        this.loop(obj[j].children,pathKey+1);
        break;
      }
    }
  };
}

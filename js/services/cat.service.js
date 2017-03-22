/**
 * cat
 * author Karl Steltenpohl
 * copyright 2017
 * UNLICENSED do not reuse
 */
function cat ($sce, $http, input, output, pwd, ls) {
  
  this.target = "";
  this.current = [];

  this.cat = function () {
    this.target = input.input[1];
    this.targetArray = this.target.split("/");
    this.current = pwd.current;
    this.combinedTarget = this.current.concat(this.targetArray);
    this.reverseLoop();
    this.loop(ls.directoryStructure,0);
    return true;
  };

  this.reverseLoop = function () {
    var count = 0;
    for(var i=0; i<this.combinedTarget.length; i++ ) {
      if(this.combinedTarget[i] == '..') {
        this.combinedTarget.splice(i-1,1);
        this.combinedTarget.splice(i-1,1);
        i=i-1;
        i=i-1;
      }
    }
  };

  this.loop = function (obj, pathKey) {
    for(var j=0; j<obj.length; j++) {      
      if(angular.isDefined(obj[j].children) && obj[j].children.length && this.combinedTarget[pathKey] == obj[j].name) {
        this.loop(obj[j].children,pathKey+1);
        break;
      } 
      // end of roots
      else {
        // check for a match
        var s = this.combinedTarget.length-1;
        if(pathKey == s && (obj[j].name == this.target || obj[j].name == this.targetArray[this.targetArray.length-1])) {
          if(angular.isDefined(obj[j].path)) {
            $http({
              method: 'GET',
              url: obj[j].path
            }).then(function successCallback(response) {
                output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='white'>&nbsp;</span>") });
                output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='white'>" + nl2br(response.data) + "</span>") });
                output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='white'>&nbsp;</span>") });
              });
          } 
          else {
            output.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='pink'>Not a file.</span>") });
          }
          break;
        }
      }
    }    
  };

  function updateScroll() {
    var element = document.getElementById("terminal-wrapper");
    element.scrollTop = element.scrollHeight;
  }

  function nl2br(txt){ 
    if(angular.isDefined(txt)) {
      return txt.replace(/\n/g, "<br />");
    }
  }
}

function cd($sce, input, pwd, ls) {

  this.destinationPwd = [];
  this.destinationArray = [];

  this.cd = function () {

    console.log('cd');
    //console.log('input', input.input);
    //console.log('pwd', pwd.current);

    this.destinationString = input.input[1];

    // ../ handling

    // remove the trailing slash(s)
    this.destinationString = this.destinationString.replace(/\/+$/, "");

    if(this.destinationString.indexOf("/") > -1) {
      this.destinationArray = this.destinationString.split("/");
    } else {
      this.destinationArray = [this.destinationString];
    }


    this.destinationPwd = pwd.current.concat(this.destinationArray);

    console.log('destinationPwd', this.destinationPwd);

    //this.countTillSuccess = 
    this.loop(ls.directoryStructure, 0);

    return true;

  };

  this.loop = function (obj, destPathKey) {
    //console.log('loop', this.destinationPwd.length, destPathKey);

    //if(this.destinationPwd[destPathKey] == '..') {
    //  this.destinationPwd.splice(destPathKey,1);
    //  this.destinationPwd.splice(destPathKey-1,1);
    //}


    for(var j=0; j<obj.length; j++) {
      // if current length matches the pathKey then we are in the obj we want to return
      //if(this.destinationPwd.length == destPathKey && obj[j].directory == false ) {
      //  console.log('No such directory');
      //  break;
      //} else 
      if(this.destinationPwd.length == destPathKey ) {
        pwd.current = this.destinationPwd;
        //console.log('YA');
        break;
      } 
      // match and get children
      else {
        //console.log('OBJA',obj[j])
        if(obj[j].name == this.destinationPwd[destPathKey] && angular.isDefined(obj[j].children) && obj[j].children.length > 0) {
          //console.log('HAYA');
          //if(obj[j].directory == true) {
            this.loop(obj[j].children, destPathKey+1);
          //}
        }

// @left off
        else if(this.destinationPwd[destPathKey] == '..') {
          this.destinationPwd.splice(destPathKey,1);
          this.destinationPwd.splice(destPathKey-1,1);

          pwd.current = this.destinationPwd;
          //console.log('MAGIC',this.destinationPwd);
          break;

          //break;
          //console.log('SPLICE', this.destinationPwd);
          //this.loop(obj, 0);
        }


      }
    }
  };

}

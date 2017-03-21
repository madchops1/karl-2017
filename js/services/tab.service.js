/**
 This is still dirty but its awseome
 forward recursive transversal is working
 @todo... backward recursive transversal
 */
function tab ($sce, output, pwd, ls) {

    this.text = "";
    this.output = "";
    this.input = [];
    this.target = "";
    this.targetArray = [];
    this.current = [];

    //
    this.tab = function(text) {

        console.log('tab', text, input);

        // check if there is a command 
        // if not then we are looking for a command
        // if there is a command we are looking for a target
        // so get the target and handle it the same way as previously
        // but use a regex on the beginning of the target string

        // target
        if (text.indexOf(" ") > -1) {

            var splitStr = text.split(" ");
            console.log('splitStr', splitStr, pwd.current);
            this.text = text;
            this.input = splitStr;
            this.command = this.input[0];
            this.target = this.input[1];
            this.targetArray = this.target.split("/");
            this.current = pwd.current;
            this.combinedTarget = this.current.concat(this.targetArray);
            this.reverseLoop();
            this.combinedTargetLength = this.combinedTarget.length-1;
            console.log('tab target', this.targetArray, this.combinedTarget, this.combinedTargetLength);
            this.loop(ls.directoryStructure, 0);
            return this.output;
        } 
        // command
        else {
            console.log('tab command');
        }

        this.input = text;


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

        var count           = 0;
        var cacheOutput     = [];
        var cacheName       = "";
        var cacheIndex      = 0;
        var cacheType       = "file";

        for(var j=0; j<obj.length; j++) {

            if(pathKey == this.combinedTargetLength) {


                var searchPattern = new RegExp('^' + this.combinedTarget[this.combinedTargetLength]);
                
                console.log('test', this.combinedTarget[this.combinedTargetLength]);
                
                if (searchPattern.test(obj[j].name)) {
                    console.log('match', obj[j].name);
                    
                    if(obj[j].directory) { cacheType = "directory"; }
                    cacheName = obj[j].name;
                    cacheIndex = j;
                    cacheOutput.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='khaki'>" + obj[j].name + " </span>") });
                    count++;
                    //break;
                }


            } else if(angular.isDefined(obj[j].children) && obj[j].children.length && (this.combinedTarget[pathKey] == obj[j].name)) {
                this.loop(obj[j].children,pathKey+1);
                break;
            }

        }

        console.log('count',count);
        if(count == 1) {

            console.log('ALPHA', this.combinedTarget, this.combinedTargetLength);

            // remove the target
            this.combinedTarget.splice(this.combinedTargetLength,1);
            
            console.log('BETA', this.combinedTarget);

            var combinedTargetString = this.combinedTarget.join("/");
            if (combinedTargetString != "") { combinedTargetString = combinedTargetString + "/"; }

            this.output = this.command + " " + combinedTargetString + cacheName;
            
            if(cacheType == "directory") {
                this.output = this.output + "/";
            }

        } else if(count > 1) {
            //if(pathKey == 1) { 
                output.output.push({ human: true, pwdString: pwd.current.join("/"), text: $sce.trustAsHtml(this.text)}); 
            //}
            output.output = output.output.concat(cacheOutput);
            this.output = this.text;
        }
    };

}

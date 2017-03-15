function ls ($sce, input, pwd) {

  this.directoryStructure = [
    {
      name: "Projects",
      directory: true,
      children: [
        { 
          name: "RobotAndPuppy.com",
          executible: true,
          url: "http://robotandpuppy.com"
        },
        { 
          name: "GoReturnMe.com",
          executible: false,
          directory: true,
          children: [
            { 
              name: "GoReturnMe.com",
              executible: true,
              directory: false,
              url: "http://goreturnme.com"
            },
            {
              name: "1st Place RedEye BigIdea Awards 2015",
              executible: true,
              url: "http://www.chicagotribune.com/redeye/redeye-big-idea-awards-winner-kickstarter-20150309-story.html"
            },
            {
              name: "readme.md",
              executible: true,
              directory: false
            }
          ]
          
        }, 
        {
          name: "Tatanka",
          executible: false,
          directory: true,
          children: [
            { name: "Documentation", executible: true, url: "https://tatanka.readme.io/v1.0" },
            { name: "Github", executible: true, url: "https://github.com/madchops1/tatanka" },
            { name: "readme.md", path: "/files/tatanka.readme.md", executible: true }
          ]
        }
      ]
    },      
    {
      name: "Labs",
      directory: true,
      children: [
        { name: "RobotAndPuppy_Threejs_Lab", executible: true, url: "http://codepen.io/madchops/pen/GWrvWN" },
        { name: "Botmap.io", executible: true, url: "http://botmap.io" },
        { name: "Addison_Tickets", executible: true, url: "https://www.facebook.com/addisontickets/" },
        { name: "Furg_Media", executible: true, url: "https://vimeo.com/user3322509/videos" }
      ]
    },
    {
      name: "resume",
      directory: false,
      executible: true,
      url: "https://docs.google.com/document/d/1cz2569FN5G4RYnMY7FaOhcpqbF1E6jhAsrGLL0KPplA/edit?usp=sharing"
    },
    {
      name: "Foosball",
      directory: true,
      executible: false,
      children: [
        {
          name: "meetup",
          url: "https://www.meetup.com/Chicago-Foosball/",
          executible: true
        }
      ]
    },
    {
      name: "Music",
      directory: true,
      children: [
        { name: "bongo_parade", executible: true, url: "https://soundcloud.com/user-948003850" }
      ]
    },
    {
      name: "Photos",
      directory: true,
      children: [
        { 
          name: "Sunrise_Rider", 
          executible: false,
          directory: true,
          children: [
            { name: "Sunrise Rider", executible: true, url: "http://sunriserider.tumblr.com/" },
            { name: "sunriserider.readme.md", executible: true }
          ]
        }
      ]
    }

  ];

  this.output = [];

  this.ls = function () { 
    this.output = []; // clear
    this.loop(this.directoryStructure, 0);
    //console.log('ls.ls()', this.output);
    return this.output;
  };

  //
  this.loop = function (obj, pathKey) {
    //console.log('loop', pwd.current.length, pathKey);
    for(var j=0; j<obj.length; j++) {

      // if current length matches the pathKey then we are in the obj we want to return
      if(pwd.current.length == pathKey ) {
        //console.log('Aobj' + pathKey, obj[j]);
        // if this is a dir()
        var output = obj[j].name;
        // url
        if(angular.isDefined(obj[j].url)) {
          output = "<a href='" + obj[j].url + "' target='_blank'>" + obj[j].name + " -> " + obj[j].url.trunc(20) + "</a>";
        } 
        // directory or file
        else {
          output = "<span class='white'>" + output + "</span>";
        }

        this.output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("<span class='orange'>" + this.permissionString(obj[j]) + "</span>" + output) });
      } 
      // match and get children
      else {
        //console.log('Bobj' + pathKey, obj[j]);
        if(obj[j].name == pwd.current[pathKey] && obj[j].children.length > 0) {
          this.loop(obj[j].children, pathKey+1);
        }
      }
    }
  };

  //
  this.permissionString = function (item) {

    var permString = "r-";

    if(item.directory == true) {
      permString = "d" + permString;
    } else {
      permString = "-" + permString;
    }

    if(item.executible) {
      permString = permString + "x ";
    } else {
      permString = permString + "- ";
    }

    return permString;
  };

  String.prototype.trunc = function( n, useWordBoundary ) {
    if (this.length <= n) { return this; }
    
    var subString = this.substr(0, n-1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "&hellip;";
  };

  //
  this.limitTo = function(str) {

    return str;
  };

}

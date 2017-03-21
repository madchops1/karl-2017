
  function terminal ($sce, input, cat, ls, cd, pwd) {
    this.command = '';
    this.flags = [];
    this.target = '';
    this.originalText = '';

    this.handle = function (text) {
      this.originalText = text;

      if (text.indexOf(' ') > -1) {
        var splitStr = text.split(" ");
        input.input = splitStr;
        this.command = splitStr[0];
      }
      else {
        input.input = text;
        this.command = text;
      }

      return this.router();
    };

    this.router = function () {
      //console.log('router()', this.command);
      switch(this.command) {
        case "help":
          return help();
          break;

        case "clear":
          return clear();
          break;

        case "ls":
          return ls.ls();
          break; 

        case "cd":
          return cd.cd();
          break;

        case "pwd":
          return pwd.pwd();
          break;

        case "cat":
          return cat.cat();
          break;

        default: 
          return { pwdString: pwd.current.join("/"), text: $sce.trustAsHtml(this.originalText) };
          break;
      }
    }

    function help() {

      var help = [
        {plain: true, text: $sce.trustAsHtml('<pre> </pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  These are some of the commands available to you:</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre> </pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  cat [target]           Print text file contents to screen.</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  cd [target]            Change to target directory.</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  clear                  Clear the terminal.</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  help                   Help for you ;)</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  ls [optional target]   List current directory contents.</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre class="white">  pwd                    Print working directory.</pre>')},
        {plain: true, text: $sce.trustAsHtml('<pre> </pre>')}
      ];

      return help;
    }

    function clear() {
      return "clear";
    }
  }

/*

                                                                                                                                                      
                                                                                                    `o.   `-    `+/+                                  
                                                                                                 -oyo+++:./ho/+::yh/                                  
                                                                                               .+s:``  `-+oso.  .+y::/+oooo/`                         
                                                                                            `.+ho:.  .o`      `  ```     ``:o.                        
                                                                                          -::sy////+o/-                     `+/`                      
                                                                                          -yyo-..`/d:   -:/:-     ``.         -o:                     
                                                                                         :os:-.-. `h:   +ydo+:  .hhsos:        `++`                   
                                                                                        sd/---.`//o:     -+yo   `/s: `-          :s-                  
                                                                                       :hoo.``.`:s+/o.   `/y/   -+-   --          .s/                 
                                                                .//:-.`                +mo/o.` ```  :   /oy:         `sh+:-        .h.                
                                                             ./so++++ooo+:::-..`       .yh+:/-`````  `:yho.`  .    .-/mhs/o.        h`                
                                                            +dds++:---:---::////+//:/::/+dh+/+:-.``../do-``  -h.   .odmyo:.``      :o                 
                                                           .d+/-:+ooooooo++//::-..``..-+oossooysdyy++hyoo+- `s/.`   -yhmoy/-``    .y.                 
                                                           /d:--.:--:::::..--::/o+o/::::+oo/+++ossyhmdshdmh``.`   -.-:od+/s-```  .s-                  
                                                          `yy``.hs....odh.      - :`....:++ossyyysssddmmdy/`     +dhs-:ds://:..`:o-                   
                                                          `d+.`:y`   -syh-     .` .     -:-./::/syyhhddmds-   `./do:``-/ysyso/+o:`                    
                                                          :y-. yy+:--ys:s         `     h/--::/yhs-/sdod/oy+++oshy.  .+/-..--/ho                      
                                                          y:.-./+ossoshy+              -y     :oy+:dmhydh:yooh:ss- `--:sy/.` :h+                      
                                                         :s `--.```.::os`              /s-.`  o-h//hhyossyyyyo/-``-:ys+/:.``  os`                     
                                                         y:.--:``                      +hs//++d+s+oohdss-```-:-/: - .`--``    os                      
                                                        :d`..:/-.``                    ./+++/+yh/-://dhoo:.oyso-. `. `        .h/                     
                                                        s+-.`` `...--`             `.--:::`   .--.-.yy/.::--.:`-`.             /h.                    
                                                       -h-... `:+yyy+s/:.`````..-/o//-.-ydy`   .--:yh/:-:.--..-``              `oy.                   
                                                       o+::.``yy-h.  `-d:/++yyo+:+s     +y+o  -:::oys:+::-.`.```                omy`                  
                                       `.--:-----`  `-/d:````/d:/o    ++   `h/   /o     :s-s   :shm-  `.:-.`` `                :do-                   
                                    `-shddhhsdhoshyosydm+.`  `y/y-   -y`   :y`   +/     oos-   -+ms  `sdo.``                 ` .h                     
                                  `/hyhso/+:..-/+yys/.yd/     `sho:.`yo   `so    s-     sh/  `.+m/   :/osy`                 -y. y-                    
                                -/hhh+-`` `+yydo-.-:::yddo/--..`-/ossso+/-oho----y+---/++-   ./yh   ./:..s:                  h- +s                    
                               ./do+:.   `hddyo/-.``` ..--:+oos++oo+//:::----::::+/:-.`    .` +mo   .-::./-                 `h` oh`                   
                               odoo+-    :m-`.-:/+sso+/::-..-.    `.:/+o+++/:-.```         : :d+    :-/.:+.`                :s  :h-                   
                              oh+//-.``..dmo/ ..-```.-::/oossoo+/::-.``   ```-:/++oo+//:-.`-`hd:   .-:--/-+-                oy+:`ys`                  
                             .m+///+//:-:sNyy:hsyy+::/:o.    `.--::/+++/++/:-.``  `--:++osyhhmd:  `/.:`..:+h/` `s/           /dh:hy/                  
                             /doo+-`     .smmms  `-/sh:o-        .`       `.-+///o+++ss+/+++smy`  :``.`:.//ymh/so`          `+. `d-                   
                             +mh:::         :ds-     s`+         `    ``.``..+..-....-::/oyydmm/`.. -`-.:::sodd:           -/++ +h`                   
                             sdhho/        `/o+yo.  `h/+   .```              - `/yo+:/++sysoyymms:  .`-.:/ohmh`     .  --` +ood`s:                    
                             +dy++/+.     /o.   .oyshyd/:+:``- .     .````...-ommmmmmmmmddmmdyo--. .-:-/sy+-` ``. . : ..+ /dym-.d`                    
                             -Nsss//..` `o-        -ohmddhsoo/+.  .``` `` ./shms/.``/-```:`o--.:+++os//:-` .` +/o.+:::sohso+:/`:y                     
                              +ddy+/----y`            .+shyhoo:--+:-`..:.:omdo-   -ys+ysohsmmhms+/..`-`:s//s++ssoyshhos:+`:`  +sm.                    
                               .omdy//-y/.                -hyyyoo/:o/:+-+omh.`` :ommdmdhyyo+::+ysyohsmhdyys+/-:../--`/`:``.   +ss+                    
                                 `+hmssm+://`            :s.  `-+ohs/o/o:+mhood-omm/.`   ``: /ydohdms++:-:+.:`:`:`: `. `     -y/`                     
                                    -+hNhsh+:...-       :y        ``-smdhyddh-mmhh:.-  `-shhhms- .hhso+:/..:`:``.``          os                       
                                      `ydhmd:/o/.-`-`:`.y:`          :s.://yddmohmddd/+smhysNds/- .d/---.``` .`          ```-ho                       
                                       ydsssdydo/:/+::-+s-.`         o:    :+dmmyN+dy+ydyo/.:dddoh`os:`` --```` `          `sd+                       
                                       sd+/s:/yddoys:/`h:+:: ```     s.    ``.+yyhhNmh+--`   `/oos`yd:```````              oho:                       
                                       /y-s::os/:ymds/+d+s/-::s`-    :-       `````-d/:-````. .-`+ydy.``     ``           /d:`                        
                                       /h/:-/++::/o/yddmdos-:./.-. `.-+`      `` -``/o.`````.::+ydyh/                    .do                          
                                       +s..-///:+--.+::oddmhys:+:-..`-y::/.-`  .``-`.:s: `:+oyo:+/+s-````           `    oh`                          
                                       s/``.---/-/-//.`:+/ssmdhyoo+o`/yh/./.-.  ..`-`/+dh+ss:o.-y`-.`````.-`            :d-                           
                                       y+--.-...-.::-`.o+:-/oo:yyshdoydmdsssso:./o+syhhy/+::.-.+:`````://.o+           .d+                            
                                      `d:  ``  -. -:``/:- -+./-/o-+dshdommNmmmmddyys+://:-:`:`..````.:++:+s-           sy`                            
                                      -m--.-...:  :  .-/``/`:+:+.+:/syh+ddddmmmyo/.+:`/.:`:.-``-:.//ydoy+.    ``      oh.                             
                                      /m`:/-`     .  --:.::`s/o/-:o+/y+hyhhmmdo/:/:/` :-...`-.oshsyoyo:.            `omy                              
                                      /d.-.`         `/  ..+y/-.yy-/soyohyddh+//:`--  ``:/+hyoddy/.`     `.`       :so:m.                             
                                      /s   `--....-:. .   .ds/:+o/h+oosohddo/++-` `` ./::-:Nh+-.`    ``          `odo-`os                             
                                      o+  :so+osyydy`    ..s:.::-/ooyhsdmo+:-.- ``:/.-//yhho-`       .`  `/-`   .hdo:-/oN.                            
                                      so. h-.....ho+     ` .``/+///:s+hNy-:`.`-`/:/.++ys+-`  .`` ``` ```-:s+.  `hNh+-  .m.                            
                                      oo-`h`    `ss..   ` .  ./++//oosho``.```:/+so/::.      .:....-:.../o+/`  +Nmyy:` `m.                            
                                      hd..m:-`` `yy     ` . -//os+:ssh/.`   .sydo:          ``-:-`:--:`oody-`  +mo+++yo:h:                            
                                     `dd``o-:::/+h-         .:oyh/shd.    `-ymy/         .`:-://:-//+osmdhmy:  .Ny+.`.yhd:                            
                                      /m+-+.` `  ` `    .`  `:/oo/md:   `:/yd/`      `-..:/+/sddoyhh+/:sd:odo.  hh/:. `/m.                            
                                      `::hNyoos+/:+:```.:   :-+:+y+` ``::yhy.       `-/:oys-hmyo+/////++oyssNo/ .hhy.  -d                             
                                         hdo  /.o/oyyyyyo+//ssoyh:  .`/ohNh`   `   `:dyddmysNso++shsoyooshdmNydso/oho-.hs                             
                                        :N+: -/./.+shyhyssshdNh/` .-:+hdmy`    `` .+hNNNdmoyNdNysdNmddmmmNNd/`::m//+yddm.                             
                                        oNs` --.:sNmo/hmdNmNd+.--:o+hhymh`    .``:+ddNNs/m+-dmNNdhNNNNNNmms.   .y `::sd/                              
                                       .oNo:./.:+NN+omo-.//h++/s/shysyds.     `-:odmNNh` /hd:ohmNmdmmmdo:``` ` sy:osdh:                               
                                       /sh/sh+::dNNNNmmo-o.o++s/ddmysd/`  `.`.+/ysdyNN/   `:y+``/--.--..`-.-.-:dsydh/                                 
                                      -/N/  `-/ohdmNmmNNmmNMmNNmd+/hh- ..-:/-yo+mdsmNh      `+y+/+oys+++/-/ossso/-`                                   
                                      :sm-`    ``.:y+sdmmmNm.dss+yd/` `::o//:dymd/hNN/        `-//+oo++++/:-.`                                        
                                       ds  `  ````::-hshdNm:yy-oh/.``.+:/yoyymyos+NN/                                                                 
                                      :N.`     .::::y++hyN+:Nys:  -.+o/hdmhhydhdhmN+                                                                  
                                      yh `.`  ---::syshhmmydhy``/:+:mhdhoo+//---ymo                                                                   
                                     `Ny.    `..:.-s/+hyNdm/hy:moyohNssh//:.`  :ms`                                                                   
                                     +m/yy+-...:-/y/+s+mNNydo:d+yNdyyyyo-``  ``dy.                                                                    
                                    `m+  `/oshhhsdhyddhMmhMNhsNNmdso:.+       sN:                                
                                    
                                    */                                     

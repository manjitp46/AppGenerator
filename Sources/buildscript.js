#!/usr/bin/env node
var fs = require("fs");
var path = require('path');

var copy = require('copy');

function addShebang() {

  var path = "build/Apps/AppGenerator.js";
  var data = "#!/usr/bin/env node\n\n";
  data += fs.readFileSync(path);
  fs.writeFileSync(path, data);
}

function copyConf() {
    try {
        copy(path.join(__dirname,"Conf/*.conf"), path.join(__dirname,"../build/Conf"),(err,file)=>{
            console.log("File", "Cpoied")
        })
    } catch (error) {
        console.log(error);
    }
}

addShebang();
copyConf();

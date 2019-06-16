import Vorpal = require("vorpal");
import { Commands } from "../Commands";

const colors = require('colors');

class AppGenerator {

    initializeCommands(): void {
        var commander = new Vorpal();
        var input = process.argv;
        // console.log(input)
        // console.log(this.ServerConfigs.runtimeConfig[this.NODE_ENV].appDelimeter)
        if(input.length <= 2) {
    
          commander.delimiter(colors.green("(AppGenerator)$")).show();
        }
        Commands.forEach(command => command.registerCommand(commander));
        commander.parse(input);
      }
    

}

new AppGenerator().initializeCommands();
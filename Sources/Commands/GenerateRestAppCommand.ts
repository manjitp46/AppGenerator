import { BaseCommand } from "./Interfaces/BaseCommand";

import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as Mustache from 'mustache';
import {Logger} from '../Logger';

const SKIP_FILES = ['node_modules', '.template.json', '.git'];
const CURR_DIR = process.cwd();
export class GenerateRestAppCommand implements BaseCommand{
    logger: Logger;
    constructor() {
        
    }
    registerCommand(vorpalApp: any): void {
        vorpalApp.command("generaterestapp <appname>", "Command to generating RestApp")
        .option("-l","Logging Required")
        .option("-a","App Name")
        .action(this.processCommandAction)
    };
     processCommandAction(args: any, cb: Function): void {
        this.logger = new Logger();
        var appName = args.appname;
        var templatePath = path.join(__dirname,'../templates/restserver')
        this.logger.info("Generating Application @",path.join(CURR_DIR, appName))
        // Creating app Dir
        shell.mkdir("-p",path.join(CURR_DIR, appName));
        //  this is the value which are replaced in Apps
        var templateValues = {
            appname: appName
        }
        new GenerateRestAppCommand().createDirectoryContents(templatePath,appName, templateValues)
        this.logger.info("project Successfully created @",CURR_DIR + `/${appName}`)
        // fs.mkdirSync(path.join(CURR_DIR, appName, "test"));
        this.logger.info(new GenerateRestAppCommand().printInstructions());
        cb();
    }

    createDirectoryContents(templatePath: string, projectName: string, templateValues: object) {
        // read all files/folders (1 level) from template folder
        const filesToCreate = fs.readdirSync(templatePath);
        
        

        // loop each file/folder
        filesToCreate.forEach(file => {
            const origFilePath = path.join(templatePath, file);
            
            // get stats about the current file
            const stats = fs.statSync(origFilePath);
        
            // skip files that should not be copied
            if (SKIP_FILES.indexOf(file) > -1) return;
            
            if (stats.isFile()) {
                // read file content and transform it using template engine
                let contents = fs.readFileSync(origFilePath, 'utf8');
                contents = this.replaceTemplateValues(contents, templateValues)
                // write file to destination folder
                var writePath = path.join(CURR_DIR, projectName, file);
                writePath = this.replaceTemplateValues(writePath, templateValues);
                fs.writeFileSync(writePath, contents, 'utf8');
            } else if (stats.isDirectory()) {
                // create folder in destination folder
                shell.mkdir("-p",path.join(CURR_DIR, projectName, file));
                // copy files/folder inside current folder recursively
                this.createDirectoryContents(path.join(templatePath, file), path.join(projectName, file),templateValues);
            }
        });
    }

    replaceTemplateValues(fileContent:string, valueObject:object): string {
        return Mustache.render(fileContent, valueObject);
    }

    private printInstructions(): string {
        return `
        "Project Successfully created"
        Please run npm install to install all dependency
        `
    }

    
} 
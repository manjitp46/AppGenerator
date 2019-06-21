import { BaseCommand } from "./Interfaces/BaseCommand";

import * as path from "path";
import * as shell from "shelljs";
import { Logger } from "../Logger";
import { TemplateManager } from "../Core/TemplateManager";
import { FileManager } from "../Core/FileManager";
import { ConfigManager } from "../Core/ConfigManger";

const CURR_DIR = process.cwd();
export class GenerateDynamicWebAppCommand implements BaseCommand {
  logger: Logger;
  constructor() {}
  registerCommand(vorpalApp: any): void {
    vorpalApp
      .command("generatewebapp <appname>", "Command to generating Dynamic WebApp")
      .option("-l", "Logging Required")
      .option("-a", "App Name")
      .action(this.processCommandAction);
  }
  async processCommandAction(args: any, cb: Function): Promise<void> {
    this.logger = new Logger();
    var appName = args.appname;
    var congigManager = new ConfigManager();
    congigManager.loadConfigFile(
      path.join(__dirname, "../Conf/AppGenerator.conf")
    );
    var templatePath = path.join(
      __dirname,
      congigManager.getSettingValue("DynamicWebApp", "TemplatePath")
    );
    this.logger.info("Generating Application @", path.join(CURR_DIR, appName));
    // Creating app Dir
    shell.mkdir("-p", path.join(CURR_DIR, appName));
    //  this is the value which are replaced in Apps
    var templateValues = {
      appname: appName
    };
    // Preparing Templates if Not Exits
    var templateManager = new TemplateManager();
    await templateManager.downLoadTemplate();
    new FileManager().createDirectoryContents(
      templatePath,
      appName,
      templateValues
    );
    // new GenerateRestAppCommand().createDirectoryContents(templatePath,appName, templateValues)
    this.logger.info(
      "project Successfully created @",
      CURR_DIR + `/${appName}`
    );
    // Clearing Everything which not required
    templateManager.deleteTemplateDir();
    this.logger.info(new GenerateDynamicWebAppCommand().printInstructions());
    cb();
  }

  private printInstructions(): string {
    return `
        "Project Successfully created"
        Please run npm install to install all dependency
        `;
  }
}

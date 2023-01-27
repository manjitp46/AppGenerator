import { Logger } from "../Logger";
import * as path from "path";
import { ConfigManager } from "./ConfigManger";
// const Git = require("nodegit");
const simpleGit = require('simple-git');
import * as shell from "shelljs";

export class TemplateManager {
  private logger: Logger;
  congigManager: ConfigManager;
  git: any;
  public constructor() {
    this.logger = new Logger();
    this.congigManager = new ConfigManager();
    this.congigManager.loadConfigFile(
      path.join(__dirname, "../Conf/AppGenerator.conf")
    );
  }

  getTemplateUrl() {
    var templateRepoType = this.congigManager.getSettingValue(
      "Templates",
      "Type"
    );
    var templateRepoSettings = null;

    if (templateRepoType) {
      templateRepoSettings = this.congigManager.getSettings(
        templateRepoType.trim()
      );
    }
    return `${templateRepoSettings.BaseURL}/${templateRepoSettings.GitHubORG}/${
      templateRepoSettings.TemplateRepository
    }.git`;
  }

  public async downLoadTemplate() {
    var url = this.getTemplateUrl();
    try {
      this.logger.info("Downloading template @", url);
      var templateRootDir = path.join(
        __dirname,
        `../${this.congigManager.getSettingValue(
          "Templates",
          "TemplateRootDir"
        )}`
      )
      shell.mkdir(templateRootDir)
      var result = await simpleGit(templateRootDir).clone(url)
      // var result = await Git.Clone(
      //   url,
      //   path.join(
      //     __dirname,
      //     `../${this.congigManager.getSettingValue(
      //       "Templates",
      //       "TemplateRootDir"
      //     )}`
      //   )
      // );
      this.logger.info("Successfully downloaded template from", url);
    } catch (e) {
      this.logger.error(e);
    }
  }

  public deleteTemplateDir() {
    try {
      this.logger.info("Clearing Downloaded files and folders");
      this.logger.info(
        "Clearing directory @",
        path.join(
          __dirname,
          `../${this.congigManager.getSettingValue(
            "Templates",
            "TemplateRootDir"
          )}`
        )
      );
      shell.rm(
        "-rf",
        path.join(
          __dirname,
          `../${this.congigManager.getSettingValue(
            "Templates",
            "TemplateRootDir"
          )}`
        )
      );
    } catch (e) {
        this.logger.error(e);
        throw e;
    }
  }
}

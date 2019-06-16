import * as fs from "fs";
import * as ini from "ini";
import * as path from "path";
import { Logger } from "../Logger";
export class ConfigManager {
  config: any;
  logger: Logger;
  public constructor() {
    this.logger = new Logger();
  }

  public loadConfigFile(configFilePath: string) {
    try {
      this.config = ini.parse(fs.readFileSync(configFilePath, "utf-8"));
      return this;
    } catch (error) {
      this.logger.error("Failed to load Config file", error);
    }
  }

  public getSections() {
    if (this.config) {
      return Object.keys(this.config);
    } else {
      return [];
    }
  }

  getSettingValue(sectionName: string, settingName: string) {
    return this.config[sectionName][settingName];
  }

  public getSettings(sectionName: string) {
    return this.config[sectionName];
  }
}

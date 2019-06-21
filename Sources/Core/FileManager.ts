import { Logger } from "../Logger";
import * as Mustache from "mustache";
import * as fs from "fs";
import * as path from "path";
const SKIP_FILES = ["node_modules", ".template.json", ".git"];
const CURR_DIR = process.cwd();
import * as shell from "shelljs";
export class FileManager {
  logger: Logger;
  public constructor() {
    this.logger = new Logger();
  }

  replaceTemplateValues(fileContent: string, valueObject: object): string {
    return Mustache.render(fileContent, valueObject);
  }

  createDirectoryContents(
    templatePath: string,
    projectName: string,
    templateValues: object
  ) {
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
        let contents = fs.readFileSync(origFilePath, "utf8");
        contents = this.replaceTemplateValues(contents, templateValues);
        // write file to destination folder
        var writePath = path.join(CURR_DIR, projectName, file);
        writePath = this.replaceTemplateValues(writePath, templateValues);
        fs.writeFileSync(writePath, contents, "utf8");
      } else if (stats.isDirectory()) {
        // create folder in destination folder
        shell.mkdir("-p", path.join(CURR_DIR, projectName, file));
        // copy files/folder inside current folder recursively
        this.createDirectoryContents(
          path.join(templatePath, file),
          path.join(projectName, file),
          templateValues
        );
      }
    });
  }
}

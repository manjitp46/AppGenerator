import { Logger } from "../Logger";
import * as path from 'path';
const Git = require('nodegit');

class TemplateManager {
    private logger: Logger
    git: any;
    public constructor() {
        this.logger = new Logger();
        // this.git = new Git();

    }

    public async downLoadTemplate(url:string) {
        try {
            this.logger.info("Downloading template @", url);
            var result = await Git.Clone(url, path.join(__dirname,'../templates/xyz'))
            this.logger.info(result);
        }catch(e) {
            this.logger.error(e);
        }
    }
}

new TemplateManager().downLoadTemplate("https://github.com/nodegit/nodegit");
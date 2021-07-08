const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'your project name',
        default: this.appname,
      }
    ]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    // 批量生成文件
    const templates = [
      'src/main.js',
      'package.json',
    ];
    templates.forEach((relPath) => {
      this.copyTemplate(
        this.templatePath(relPath),
        this.destinationPath(relPath),
        this.answers,
      )
    })
  }
}
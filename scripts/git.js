#!/usr/bin/env node
const git = require('simple-git/promise')();
const inquirer = require("inquirer");
const ora = require("ora");
const params = [
    {
        type: 'input',
        name: 'commit',
        message: '请输入GIT提交备注：',
        default: 'await'
    }
]
inquirer.prompt(params).then(async (answers) => {
    const commit = answers.commit;
    const spinner = ora({
        text: "开始提交",
    }).start()
    await git.add('./*')
    spinner.color = "blue";
    spinner.text = "添加成功";
    await git.commit(commit);
    spinner.text = "本地提交成功";
    await git.push();
    spinner.text = "推送完成";
    spinner.succeed("推送完成");
})
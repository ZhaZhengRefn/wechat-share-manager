// 预发布脚本
/**
 * 1. 修改版本号
 * 2. 执行build脚本
 */
const exec = require('child_process').execSync
const ora = require('ora');
const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const inquirer = require('inquirer')

const package = path.resolve(__dirname, '../package.json')
const spinner = ora('building script\n')

if (!fs.existsSync(package)) {
  throw new Error('package.json not exist...')
}

async function run() {
  const {
    version,
  } = await inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: '>>>Please input the next version:'
  }])
  try {
    spinner.start()
    const pFile = path.resolve(__dirname, '../package.json')

    let conf = fs.readFileSync(pFile, {
      encoding: 'utf8'
    })
    conf = conf.replace(JSON.parse(conf).version, version)

    fs.writeFileSync(pFile, conf)

    exec('npm run build')

    spinner.succeed()
  } catch (error) {
    console.log(error)
  }
}

run()
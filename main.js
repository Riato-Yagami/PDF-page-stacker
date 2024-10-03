const config = require("./config/config");

global.__basedir = __dirname;
global.config = require(__basedir + '/config/config')
global.fun = require(__basedir + '/loaders/load-functions')

require(__basedir + '/loaders/prototype.js')

const fs = require('fs');
const clc = require('cli-color');

async function processAllPdfs() {
    const files = fs.readdirSync(config.inputDir);

    for (const fileName of files) {
        const file = fun.parseFile(fileName);
        // console.log(file)
        fun.processFile(file);
    }
}

fun.checkDir(config.inputDir)
fun.checkDir(config.outputDir)
fun.checkDir(config.processedDir)

processAllPdfs()
    .then(() => console.log(clc.bgGreen('All files processed successfully!')))
    .catch(err => console.error(clc.bgRed('Error processing files:'), err));

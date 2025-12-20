const config = require("./config/config");

global.__basedir = __dirname;
global.config = require(__basedir + '/config/config');
global.fun = require(__basedir + '/loaders/load-functions');

require(__basedir + '/loaders/prototype.js');

const fs = require('fs');
const clc = require('cli-color');

async function processAllPdfs() {
    const files = fs.readdirSync(config.inputDir);

    for (const fileName of files) {
        const file = await fun.parseFile(fileName); // await if parseFile is async
        
        await fun.processFile(file); // await to ensure each file is processed sequentially
    }
}


fun.checkDir(config.inputDir);
fun.checkDir(config.outputDir);
fun.checkDir(config.processedDir);

const args = process.argv.slice(2, process.argv.length);
const times = parseInt(args[0]) || 1; // Parse argument to ensure it's a number

// Run processAllPdfs multiple times sequentially
(async () => {
    for (let i = 0; i < times; i++) {
        try {
            await processAllPdfs();
            console.log(clc.bgGreen(`All files processed successfully (Run ${i + 1})!`));
        } catch (err) {
            console.error(clc.bgRed(`Error processing files on run ${i + 1}:`), err);
        }
    }
})();

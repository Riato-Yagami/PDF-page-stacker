const fs = require('fs');
const path = require('path');
const clc = require('cli-color');
const { extname, basename, join } = path;

module.exports = (file) => {
    processFile(file);
    return;
}

async function processFile(file) {
    try {
        const pdfBuffer = await fun.getPdfBuffer(file)
        const duplicatedPdfBuffer = await fun.duplicatePdf(pdfBuffer);
        fs.writeFileSync(file.outputPath, duplicatedPdfBuffer);
        
        if(config.moveProcessedFile){ // Move processed file
            fs.rename(file.inputPath, file.processedPath, function (err) {
                if (err) throw err
            })
        }

        console.log(`Processed: ${clc.blue(file.name)} -> ${clc.blue(file.outputName)}`);
    } catch (error) {
        console.error(clc.red(`Failed to process ${file}:`), error);
    }
}
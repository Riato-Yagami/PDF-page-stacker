const fs = require('fs');
const path = require('path');
const clc = require('cli-color');

module.exports = async (file) => {
    await processFile(file);
    return;
}

async function processFile(file) {
    try {
        file.pdfBuffer = await fun.getPdfBuffer(file)
        const duplicatedPdfBuffer = await fun.duplicatePdf(file);
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
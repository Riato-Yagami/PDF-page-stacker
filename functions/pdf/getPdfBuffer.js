const fs = require('fs');
const clc = require('cli-color');

module.exports = async (file) => {
    const pdfBuffer = await getPdfBuffer(file);
    return pdfBuffer;
}

async function getPdfBuffer(file) {
    let pdfBuffer

    switch (file.extension) {
        case '.pdf': pdfBuffer = fs.readFileSync(file.inputPath); break;
        case '.png': case '.jpg': case '.jpeg':
            const imageBuffer = fs.readFileSync(file.inputPath);
            pdfBuffer = await fun.imageToPdf(imageBuffer,file.extension); break;
        default: console.log(clc.yellow(`Skipping unsupported file type: ${file.name}`)); break;
    }

    return pdfBuffer
}
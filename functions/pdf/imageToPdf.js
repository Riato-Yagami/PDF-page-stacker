const { PDFDocument } = require('pdf-lib');

module.exports = async (imageBuffer,fileExt) => {
    const pdfBuffer = await convertImageToPdf(imageBuffer,fileExt);
    return pdfBuffer;
}

async function convertImageToPdf(imageBuffer,fileExt) {
    const pdfDoc = await PDFDocument.create();

    switch (fileExt) {
        case '.png': embeddedImage = await pdfDoc.embedPng(imageBuffer); break;
        case '.jpg': case '.jpeg': embeddedImage = await pdfDoc.embedJpg(imageBuffer); break;
        default: throw new Error(`Unsupported image format: ${ext}`);
    }

    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
    });

    const buffer = await pdfDoc.save();
    // fs.writeFileSync(outputPath, pdfBytes);

    return buffer
}
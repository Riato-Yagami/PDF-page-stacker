const { PDFDocument } = require('pdf-lib');

module.exports = async (pdfBuffer) => {
    const duplicatedPdfBuffer = await duplicatePdfPage(pdfBuffer);
    return duplicatedPdfBuffer;
}

async function duplicatePdfPage(pdfBuffer) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const duplicatedPdfDoc = await PDFDocument.create();
    const [firstPage] = await pdfDoc.getPages();
    const embeddedPage = await duplicatedPdfDoc.embedPage(firstPage);
    const isLandscape = embeddedPage.width > embeddedPage.height;
    let page;

    if (isLandscape) {
        page = duplicatedPdfDoc.addPage([embeddedPage.width, embeddedPage.height * 2]);
        page.drawPage(embeddedPage, { x: 0, y: embeddedPage.height, width: embeddedPage.width, height: embeddedPage.height });
        page.drawPage(embeddedPage, { x: 0, y: 0, width: embeddedPage.width, height: embeddedPage.height });
    } else {
        page = duplicatedPdfDoc.addPage([embeddedPage.width * 2, embeddedPage.height]);
        page.drawPage(embeddedPage, { x: 0, y: 0, width: embeddedPage.width, height: embeddedPage.height });
        page.drawPage(embeddedPage, { x: embeddedPage.width, y: 0, width: embeddedPage.width, height: embeddedPage.height });
    }

    const buffer = await duplicatedPdfDoc.save();
    // fs.writeFileSync(outputPath, pdfBytes);
    return buffer
}
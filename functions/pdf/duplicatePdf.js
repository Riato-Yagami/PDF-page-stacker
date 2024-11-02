const { width, height } = require('cli-color/window-size');
const { PDFDocument } = require('pdf-lib');

const A4 = {height : 842, width : 595}
module.exports = async (file) => {
    const duplicatedPdfBuffer = await duplicatePdfPage(file);
    return duplicatedPdfBuffer;
}

const scaledDimensions = (height,width) => {
    const isLandscape = width > height;
    if (isLandscape) {
        const maxWidth = A4.height; // 842 points for A4 height in landscape
        const maxHeight = A4.width; // 595 points for A4 width in landscape
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
    } else {
        const maxWidth = A4.width; // 595 points for A4 width in portrait
        const maxHeight = A4.height; // 842 points for A4 height in portrait
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
    }

    return [height,width]
}

async function duplicatePdfPage(file) {
    const pdfDoc = await PDFDocument.load(file.pdfBuffer);
    const duplicatedPdfDoc = await PDFDocument.create();
    const [firstPage] = await pdfDoc.getPages();
    const embeddedPage = await duplicatedPdfDoc.embedPage(firstPage);
    let page;

    let width = embeddedPage.width
    let height = embeddedPage.height
    const isLandscape = width > height;

    [height,width] = scaledDimensions(height,width)

    const baseThickness = 1; // Original thickness value before scaling
    const baseDashArray = [7, 3, 1, 3]; // Original dash pattern lengths

    let line = {
        thickness: baseThickness / file.multiplier,
        dashArray: baseDashArray.map(length => length / file.multiplier),
        dashPhase: 100
    };
    
    console.log(width,height)
    if (isLandscape) {
        page = duplicatedPdfDoc.addPage([width, height * 2]);
        page.drawPage(embeddedPage, { x: 0, y: height, width: width, height: height });
        page.drawPage(embeddedPage, { x: 0, y: 0, width: width, height: height });

        line.start = { x: 0, y: height }
        line.end = { x: width, y: height }
    } else {
        page = duplicatedPdfDoc.addPage([width * 2, height]);
        page.drawPage(embeddedPage, { x: 0, y: 0, width: width, height: height });
        page.drawPage(embeddedPage, { x: width, y: 0, width: width, height: height });

        line.start = { x: width, y: 0 }
        line.end = { x: width, y: height }
    }

    page.drawLine(line)

    const buffer = await duplicatedPdfDoc.save();
    // fs.writeFileSync(outputPath, pdfBytes);
    return buffer
}
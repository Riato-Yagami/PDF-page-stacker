const fs = require('fs');
const path = require('path');
const clc = require('cli-color');
const { PDFDocument } = require('pdf-lib');
const { extname, basename, join } = path;

async function convertImageToPdf(imagePath, outputPath) {
    const pdfDoc = await PDFDocument.create();
    const imageBytes = fs.readFileSync(imagePath);

    let embeddedImage;
    const ext = extname(imagePath).toLowerCase();
    if (ext === '.png') {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else if (ext === '.jpg' || ext === '.jpeg') {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else {
        throw new Error(`Unsupported image format: ${ext}`);
    }

    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    return outputPath;
}

async function duplicatePdfPage(inputPath, outputPath) {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
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

    const pdfBytes = await duplicatedPdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
}

function extractMultiplier(fileName) {
    const match = fileName.match(/-x(\d+)$/);
    if (match) {
        return parseInt(match[1], 10); // Extracts the multiplier (e.g., 'x2' -> 2)
    }
    return 1; // Default multiplier if none is found
}

async function processAllPdfs(inputDir, outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const files = fs.readdirSync(inputDir);

    for (const file of files) {
        const inputFilePath = join(inputDir, file);
        const fileExt = extname(file).toLowerCase();
        let fileNameWithoutExt = basename(file, fileExt);

        let multiplier = extractMultiplier(fileNameWithoutExt) * 2;
        fileNameWithoutExt = fileNameWithoutExt.replace(/-x\d+$/, ''); // Remove the '-xN' part from filename

        // console.log(clc.blue(`Processing file: ${file}`)); // File name in blue

        try {
            let pdfFilePath;

            if (fileExt === '.pdf') {
                pdfFilePath = inputFilePath; // It's already a PDF
            } else if (fileExt === '.png' || fileExt === '.jpg' || fileExt === '.jpeg') {
                pdfFilePath = join(outputDir, `${fileNameWithoutExt}.pdf`);
                await convertImageToPdf(inputFilePath, pdfFilePath);
                // console.log(clc.green(`Converted image ${file} to PDF: ${pdfFilePath}`));
            } else {
                console.log(clc.yellow(`Skipping unsupported file type: ${file}`));
                continue;
            }
            
            const outputFileName = `${fileNameWithoutExt}-x${multiplier}.pdf`;
            const outputFilePath = join(outputDir, outputFileName);

            await duplicatePdfPage(pdfFilePath, outputFilePath);
            console.log(`Processed: ${clc.blue(file)} -> ${clc.blue(outputFileName)}`);

            if (fileExt !== '.pdf') {
                fs.unlinkSync(pdfFilePath); // Delete the temporary single-page PDF
                console.log(`Deleted temporary PDF: ${clc.magenta(pdfFilePath)}`);
            }
        } catch (error) {
            console.error(clc.red(`Failed to process ${file}:`), error);
        }
    }
}

const inputDir = join(__dirname, 'files/input');  // Replace with the path to your input folder
const outputDir = join(__dirname, 'files/output'); // Replace with the path to your output folder

processAllPdfs(inputDir, outputDir)
    .then(() => console.log(clc.bgGreen('All files processed successfully!')))
    .catch(err => console.error(clc.bgRed('Error processing files:'), err));

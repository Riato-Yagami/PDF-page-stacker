const { PDFDocument } = require('pdf-lib');

const A4_PORTRAIT = { width: 595.28, height: 841.89 };
const A4_LANDSCAPE = { width: 841.89, height: 595.28 };

// marges en points (modifiables)
const MARGIN_X = 0; // marge horizontale
const MARGIN_Y = 0; // marge verticale

module.exports = async (file, scale = config.scale) => {
    return await multiplyOnA4(file, scale);
};

async function multiplyOnA4(file, scale) {
    const srcPdf = await PDFDocument.load(file.pdfBuffer);
    const outPdf = await PDFDocument.create();

    const [srcPage] = srcPdf.getPages();
    const { width, height } = srcPage.getSize();

    // --- calcul initial pour déterminer le nombre de copies
    const portrait = fun.computeGrid(
        { width: A4_PORTRAIT.width - 2 * MARGIN_X, height: A4_PORTRAIT.height - 2 * MARGIN_Y },
        width * scale,
        height * scale
    );
    const landscape = fun.computeGrid(
        { width: A4_LANDSCAPE.width - 2 * MARGIN_X, height: A4_LANDSCAPE.height - 2 * MARGIN_Y },
        width * scale,
        height * scale
    );

    const useLandscape = landscape.multiplier > portrait.multiplier;
    const pageFormat = useLandscape ? A4_LANDSCAPE : A4_PORTRAIT;
    let { cols, rows } = useLandscape ? landscape : portrait;

    if (cols === 0 || rows === 0) {
        throw new Error('Impossible to fit page on A4 avec ce scale et ces marges');
    }

    if (config.recalculateScale) {
        // --- recalcul du scale pour maximiser la taille des copies en tenant compte des marges
        const scaleX = (pageFormat.width - 2 * MARGIN_X) / (cols * width);
        const scaleY = (pageFormat.height - 2 * MARGIN_Y) / (rows * height);
        scale = Math.min(scaleX, scaleY); // on garde le ratio pour ne pas déformer
    }

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const a4Page = outPdf.addPage([pageFormat.width, pageFormat.height]);
    const embeddedPage = await outPdf.embedPage(srcPage);

    // origine de la grille (coin haut gauche avec marge)
    const startX = MARGIN_X;
    const startY = pageFormat.height - MARGIN_Y - scaledHeight;

    // --- placement des copies
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = startX + c * scaledWidth;
            const y = startY - r * scaledHeight;

            a4Page.drawPage(embeddedPage, {
                x,
                y,
                xScale: scale,
                yScale: scale
            });

            // traits de coupe ou lignes optionnelles ici
            // fun.drawPrintLines(a4Page, scaledWidth, scaledHeight, x, y)
        }
    }

    // lignes séparatrices optionnelles
    fun.drawDashedLines(a4Page, scaledWidth, scaledHeight, startX, startY, cols, rows);

    // --- meta
    fun.writeMultiplier(file, cols * rows);
    file.orientation = useLandscape ? 'landscape' : 'portrait';
    file.finalScale = scale;

    return await outPdf.save();
}

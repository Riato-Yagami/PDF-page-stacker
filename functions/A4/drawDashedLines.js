// const DASH = [1, 4, 3, 4];
const DASH = [3,3];
const LINE_WIDTH = 0.3;

module.exports = async (a4Page,scaledWidth,scaledHeight,startX,startY,cols,rows,) => {
    console.log(`Drawing : ${cols} cols / ${rows} rows`)
    // --- lignes verticales
    for (let c = 1; c < cols + 1; c++) {
        console.log(`Drawing col ${c}`)
        const x = startX + c * scaledWidth;
        a4Page.drawLine({
            start: { x, y: startY + scaledHeight },
            end: { x, y: startY - rows * scaledHeight },
            thickness: LINE_WIDTH,
            dashArray: DASH
        });
    }

    // --- lignes horizontales
    let mrow = (rows == 1)? rows : rows - 1;
    for (let r = 0; r < mrow; r++) {
        console.log(`Drawing row ${r}`)
        const y = startY - r * scaledHeight;
        a4Page.drawLine({
            start: { x: startX, y },
            end: { x: startX + cols * scaledWidth, y },
            thickness: LINE_WIDTH,
            dashArray: DASH
        });
    }
}
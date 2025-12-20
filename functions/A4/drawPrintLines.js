const CUT_LENGTH = 10; // longueur du trait de coupe en points
const LINE_WIDTH = 0.5;

module.exports = async (a4Page,scaledWidth,scaledHeight,x,y) => {
        // --- traits de coupe
        // coin haut-gauche
        let x0 = x;
        let y0 = y;
        a4Page.drawLine({ start: { x: x0, y: y0 }, end: { x: x0 + CUT_LENGTH, y: y0 }, thickness: LINE_WIDTH });
        a4Page.drawLine({ start: { x: x0, y: y0 }, end: { x: x0, y: y0 - CUT_LENGTH }, thickness: LINE_WIDTH });

        // coin haut-droit
        let x1 = x + scaledWidth;
        let y1 = y;
        a4Page.drawLine({ start: { x: x1, y: y1 }, end: { x: x1 - CUT_LENGTH, y: y1 }, thickness: LINE_WIDTH });
        a4Page.drawLine({ start: { x: x1, y: y1 }, end: { x: x1, y: y1 - CUT_LENGTH }, thickness: LINE_WIDTH });

        // coin bas-gauche
        let x2 = x;
        let y2 = y - scaledHeight;
        a4Page.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 + CUT_LENGTH, y: y2 }, thickness: LINE_WIDTH });
        a4Page.drawLine({ start: { x: x2, y: y2 }, end: { x: x2, y: y2 + CUT_LENGTH }, thickness: LINE_WIDTH });

        // coin bas-droit
        let x3 = x + scaledWidth;
        let y3 = y - scaledHeight;
        a4Page.drawLine({ start: { x: x3, y: y3 }, end: { x: x3 - CUT_LENGTH, y: y3 }, thickness: LINE_WIDTH });
        a4Page.drawLine({ start: { x: x3, y: y3 }, end: { x: x3, y: y3 + CUT_LENGTH }, thickness: LINE_WIDTH });
}


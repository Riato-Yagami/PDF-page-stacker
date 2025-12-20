module.exports = (page, contentWidth, contentHeight) => {
    return computeGrid(page, contentWidth, contentHeight);
}

function computeGrid(page, contentWidth, contentHeight) {
    const cols = Math.floor(page.width / contentWidth);
    const rows = Math.floor(page.height / contentHeight);

    return {
        cols,
        rows,
        multiplier: cols * rows
    };
}
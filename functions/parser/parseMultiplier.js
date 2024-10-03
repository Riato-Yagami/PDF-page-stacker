module.exports = (fileName) => {
    const multiplier = parseMultiplier(fileName);
    return multiplier;
}


function parseMultiplier(fileName) {
    const match = fileName.match(/-x(\d+)$/);
    if (match) {
        return parseInt(match[1], 10); // Extracts the multiplier (e.g., 'x2' -> 2)
    }
    return 1; // Default multiplier if none is found
}
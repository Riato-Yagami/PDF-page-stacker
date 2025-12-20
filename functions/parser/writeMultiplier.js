const path = require('path');
const { join } = path;

module.exports = (file, multiplier) => {
    writeMultiplier(file, multiplier);
}

function writeMultiplier(file, multiplier) {
    file.multiplier = multiplier;
    file.outputName = `${file.nameWithoutExt}-x${file.multiplier}.pdf`;
    file.outputPath = join(config.outputDir, file.outputName);
}
const path = require('path');
const { extname, basename, join } = path;

module.exports = (dir,fileName) => {
    const file = parseFile(dir,fileName);
    return file;
}

function parseFile(name) {
    let file = {
        name : name,
        extension : extname(name).toLowerCase(),
        inputPath : join(config.inputDir, name),
        processedPath : join(config.processedDir, name),
    }

    file.nameWithoutExt = basename(name, file.extension)
    file.multiplier = fun.parseMultiplier(file.nameWithoutExt) * 2;
    file.nameWithoutExt = file.nameWithoutExt.replace(/-x\d+$/, '')

    file.outputName = `${file.nameWithoutExt}-x${file.multiplier}.pdf`;
    file.outputPath = join(config.outputDir, file.outputName);
    return file
}
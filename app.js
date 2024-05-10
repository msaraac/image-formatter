const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const startPath = path.join(__dirname, 'non-formatted');


const checkPathAndFormat = (filePath) => {
    fs.readdir(filePath,  { withFileTypes: true },function (err, files) {
        files.forEach(function (file) {
            const filenameSplitted = file.name.split('.')

            const sharpFile = sharp(path.join(filePath, file.name))
            const newPath = filePath.replace('non-formatted', 'formatted')

            if (!fs.existsSync(newPath)){
                fs.mkdirSync(newPath)
            }

            if (file.name.startsWith('.')){
                return
            }

            if (file.isDirectory()){
                checkPathAndFormat(path.join(filePath, file.name))
            } else {
                fs.stat(path.join(filePath, file.name), function(err, stats) {
                    const newFilename = `${newPath}/${filenameSplitted[0]}.webp`
                    const resp = sharpFile
                        .webp({ lossless:false, quality: 20, alphaQuality: 20, force: false })
                        .toFile(newFilename)
                        .then(r => console.log(`${file.name} -> Difference: ${(Math.abs(stats.size - r.size) / ((stats.size + r.size) / 2) * 100).toFixed(2)} %`));
                })
            }
        });
    })
}

checkPathAndFormat(startPath)





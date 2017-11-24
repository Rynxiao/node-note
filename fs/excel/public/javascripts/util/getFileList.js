const fs = require('fs');
const path = require('path');

const fileDir = path.join(__dirname, '../../uploads/excel');

function getFileList() {
    return new Promise((resolve, reject) => {
        fs.readdir(fileDir, function(err, names) {
            if (names.indexOf('.DS_Store') !== -1) {
                names = names.slice(1);
            }

            if (err) {
                reject(err);
            }

            resolve(names);
        });
    });
}

function isFileExists(fileName) {
    return new Promise((resolve, reject) => {
        fs.readdir(fileDir, function(err, names) {
            let exist = false;
            if (names.indexOf('.DS_Store') !== -1) {
                names = names.slice(1);
            }

            if (err) {
                reject(err);
            }

            exist = names.some(name => name.indexOf(fileName) !== -1);

            resolve(exist);
        });
    });
}

function deleteFile(path) {
    let result = {
        success: true,
        code: 200,
        message: '删除成功',
        data: null
    };

    return new Promise((resolve, reject) => {
        let fullPath = fileDir + '/' + path;
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        } else {
            result.success = false;
            result.code = 401;
            result.message = '文件不存在';
        }
        resolve(result);
    });
}

module.exports = {
    getFileList,
    isFileExists,
    deleteFile
};


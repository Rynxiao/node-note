const path = require('path')
const os = require('os')
const fs = require('fs')
const XLSX = require('xlsx');
const { deleteFile } = require('./getFileList.js');

const fileDir = path.join(__dirname, '../../uploads/excel');

function writeExcel(wb, path) {
    /**
     * workbook 形如下面的格式：
     * {
     *     SheetNames: ['Sheet1'],
     *     Sheets: {
     *         'Sheet1': {
     *             '!ref': 'A1:E4',
     *             A1: { v: 'id' },
     *             B1: { v: 'name' },
     *             C1: { v: 'age' },
     *             D1: { v: 'country' },
     *             E1: { v: 'remark' },
     *             ...
     *             E3: { v: 'hello' },
     *             A4: { v: '3' },
     *             B4: { v: 'test3' },
     *             C4: { v: '32' },
     *             D4: { v: 'China' },
     *             E4: { v: 'hello' }
     *         }
     *     }
     * }
     */

    XLSX.writeFile(wb, fileDir + '/ts-' + path);
}

function assembleJson(workSheet, sheetName) {
    let json = {};

    workSheet.forEach((sheet, index) => {
        let keys = Object.keys(sheet);
        keys.forEach((key, idx) => {
            if (index === 0) {
                let h_v = key;
                let h_code = String.fromCharCode(65 + idx) + '1';
                json[h_code] = { v: h_v };
            }
            let v = sheet[key];
            let code = String.fromCharCode(65 + idx) + (index + 2);
            json[code] = { v: v + '-new' };
        });
    });

    let outputPos = Object.keys(json);
    let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    return { [sheetName]: Object.assign({}, json, { '!ref': ref }) };
}

function formatSheetData(workbook) {
    let sheets = {};
    let sheetNames = workbook.SheetNames;
    if (sheetNames.length > 0) {
        sheetNames.forEach(sheetName => {
            let workSheet = workbook.Sheets[sheetName];
            let sheetData = XLSX.utils.sheet_to_json(workSheet);
            let sheetJson = assembleJson(sheetData, sheetName);
            sheets = Object.assign({}, sheets, sheetJson);
        })
    }

    let wb = {
        SheetNames: sheetNames,
        Sheets: sheets
    };

    return wb;
}
 
function transformExcel(path) {
    return new Promise(async (resolve, reject) => {
        let fullPath = fileDir + '/' + path;
        let result = {
            success: true,
            code: 200,
            message: '文件装换成功',
            data: null
        };

        let workbook = XLSX.readFile(fullPath);
        let transformWb = formatSheetData(workbook);

        // 写入新的excel
        writeExcel(transformWb, path);

        // 删除原始文件
        result = Object.assign({}, result, await deleteFile(path), { data: { path: 'ts-' + path } });
        resolve(result);
    });
}

module.exports = {
    transformExcel
};
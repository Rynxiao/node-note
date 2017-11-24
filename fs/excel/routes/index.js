const router = require('koa-router')();
const path = require('path');
const { uploadFile } = require('../public/javascripts/util/upload.js');
const { transformExcel } = require('../public/javascripts/util/transform.js');
const { getFileList, deleteFile } = require('../public/javascripts/util/getFileList.js');
const regexp = /\w+<<(.*?)/;

// 路由
router.get('/', async (ctx, next) => {
    let fileList = await getFileList();
    let fullList = fileList;

    if (fileList.length > 0) {
        fileList = fileList.map(file => {
            return file.replace(regexp, '$1');
        });
    }

    await ctx.render('index', {
        title: 'Hello Excel!',
        fileList,
        fullList 
    })
})

router.get('/delete', async (ctx, next) => {
    let result = { success: false };
    let path = ctx.query.path;
    
    // 删除文件
    result = await deleteFile(path);

    ctx.body = result;
})

router.get('/transform', async (ctx, next) => {
    let result = { success: false };
    let path = ctx.query.path;

    // 转换excel
    result = await transformExcel(path);

    ctx.body = result;
});

router.post('/upload', async (ctx, next) => {
    // 上传文件请求处理
    let result = { success: false }
    let serverFilePath = path.join( __dirname, '../public/uploads' )

    // 上传文件事件
    result = await uploadFile( ctx, {
        fileType: 'excel',
        path: serverFilePath
    });

    ctx.body = result
});

module.exports = router;

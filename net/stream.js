var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, 'files');

var readStream = fs.createReadStream(filePath + '/a.txt');
var writeStream = fs.createWriteStream(filePath + '/aa.txt');

//读取数据
readStream.on('data',function(chunk){
    // 如果读取的数据还在缓存区，还没有被写入
    if(!writeStream.write(chunk)) {
        // 停止读数据
        readStream.pause();
    }
});

// 如果数据读取完成
readStream.on('end',function(chunk){
    // 停止写入数据
    writeStream.end();
});

// 如果缓存区的数据被消耗完
writeStream.on('drain',function(){
    //接着读取数据
    readStream.resume();
});
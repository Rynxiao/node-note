var net = require('net');

var clientList = [];

var server = net.createServer(function(socket) {
    clientList.push(socket);

    socket.write(
        '\n> 欢迎来到\033[92m 简易聊天室 \033[39m'
        + '\n> 当前有' + clientList.length + '人在线'
        + '\n> 请输入您的昵称 + \'#\'，按回车键结束'
    );

    function boardcast(clientList, msg, type) {
        if (type === 'name') {
            var users = clientList.map(function(client, index) {
                return client.name;
            });
        }
        
        // 通知用户上线了
        for (var i = 0; i < clientList.length; i++) {
            if (socket !== clientList[i]) {
                if (type === 'name') {
                    clientList[i].write(msg + '\n当前在线：【 ' + users.join(',') + ' 】');
                } else {
                    clientList[i].write(msg);
                }
            }
        }
    }

    socket.on('data', function(chunk) {
        var data = chunk.toString('utf8');

        // 输入昵称
        if (data.indexOf('#') !== -1) {
            var nickName = data.split('#')[0];
            if (!socket.name) {
                socket.name = nickName;
                boardcast(clientList, '\033[33m '+ nickName +' \033[39m上线了', 'name')
            }
        } else {
            boardcast(clientList, '> \033[33m' + socket.name + '\033[39m: ' + data.replace('\n', ''));
        }
    });

    socket.on('close', function() {
        var index = clientList.indexOf(socket);
        clientList.splice(index, 1);
        console.log(socket.name + '童鞋下线了');
    });

    socket.on('error', function(err) {
        console.log('服务器遇到了一个不知名的错误，正在抢救中...');
    });
    
});

server.listen(8194, function() {
    console.log('聊天服务器已经在本地8194端口启动，赶快去试试吧！');
});
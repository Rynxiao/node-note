var net = require('net');

const PORT = 8888;
const HOST = '127.0.0.1';

var server = net.createServer(function(socket) {

    console.log('localAddress', socket.localAddress);
    console.log('localPort', socket.localPort);

    console.log('remoteAddress', socket.remoteAddress);
    console.log('remoteFamily', socket.remoteFamily);
    console.log('remotePort', socket.remotePort);

    socket.setEncoding('utf8');

    socket.write('连接到服务器');

    socket.on('data', function(chunk) {
        console.log(chunk.toString());
    });

    socket.on('error', function() {
        console.log('An error occur');
        socket.close();
    });

    socket.on('close', function() {
        console.log('socket closed');
    });
});

server.listen(PORT, HOST, function() {
    var address = server.address();
    console.log('server start on ' + HOST + ':' + PORT);
});

server.on('listening', function() {
    console.log("I'm listening");
});

server.on('close', function() {
    console.log('Server closed');
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(() => {
            server.close();
            server.listen(PORT, HOST);
        }, 1000);
    }
});
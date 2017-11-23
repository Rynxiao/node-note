var EventEmitter = require('events');
var myEE = new EventEmitter();

myEE.on('message', function(word) {
    console.log('I receive a message says: ' + word);
});

myEE.on('game', function(gameName) {
    console.log('I will to play the game of name: ' + gameName);
});

// I receive a message says: Hello world
// I will to play the game of name: KOF
myEE.emit('message', 'Hello world');
myEE.emit('game', 'KOF');

myEE.on('foo', function() {
    console.log('foo 1');
});

myEE.on('foo', function() {
    console.log('foo 2');
});

myEE.on('foo', function() {
    console.log('foo 3');
    // 异步调用不能保证顺序执行
    process.nextTick(function() {
        console.log('foo 3 async');
    });
});

myEE.on('foo', function() {
    console.log('foo 4');
});

// foo 1
// foo 2
// foo 3
// foo 4
// foo 3 async
myEE.emit('foo');

myEE.once('bar', function() {
    console.log('bar 1');
});

// bar 1
myEE.emit('bar');
myEE.emit('bar');
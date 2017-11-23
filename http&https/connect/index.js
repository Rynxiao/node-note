var connect = require('connect');
var http = require('http');

var app = connect();

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/foo', function(req, res, next) {
    console.log('do something with foo 1');
    next();
});

app.use('/foo', function(req, res, next) {
    console.log('do something with foo 2');
    next();
});

app.use('/foo', function(req, res, next) {
    res.end("I'm end with foo");
})

app.use('/bar', function(req, res, next) {
    console.log('do something with bar');
    next();
});

// respond to all requests
app.use(function(req, res){
    console.log('on end middleware');
    res.end('Hello from Connect!\n');
});


//create node.js http server and listen on port
http.createServer(app).listen(3000);
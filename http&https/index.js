var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var superagent = require('superagent');
var cheerio = require('cheerio');

var books = require('./books');
var jdUrl = 'https://search.jd.com/Search?keyword=%E5%9B%BE%E4%B9%A6&enc=utf-8&wq=%E5%9B%BE%E4%B9%A6&pvid=1bafbb8a0a0c4bab8f04d93323306aa9';

var port = 3000;
var host = '127.0.0.1';

var htmlMap = {
    '': 'index.html',
    'add': 'add.html',
    '404': '404.html',
    'detail': 'detail.html'
}

function getBooksFromJD() {
    superagent.get(jdUrl).end(function(err, sres) {
        if (err) {
            return;
        }

        var $ = cheerio.load(sres.text);
        $('#J_goodsList .gl-item').each(function(index, item) {
            var $item = $(item);
            var price = $item.find('.p-price i').text();
            var name = $item.find('.p-name em').text();
            var publish = $item.find('.p-bookdetails .p-bi-store').text();
            var author = $item.find('.p-bookdetails .p-bi-name a').text();
            var description = $item.find('.p-name .promo-words').text();
            books.push({
                id: uuidV4(),
                name: name, 
                price: price,
                publish: publish,
                author: author,
                description: description
            });
        });
    })
}

function readContent(filePath) {
    return fs.readFileSync(filePath);
}

function getHtml(res, path) {
    res.writeHeader(200, { 'Content-Type': 'text/html' });
    var content = readContent(`./views/${path}`);
    res.end(content);
}

function getBooks(res) {
    res.writeHeader(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: 200, data: books }));
}

function addBook(req, res) {
    res.writeHeader(200, { 'Content-Type': 'application/json' });

    var post = '';

    req.on('data', function(chunk) {
        post += chunk;
    });

    req.on('end', function() {
        post = querystring.parse(post);
        post.id = uuidV4();
        books.push(post);
    });

    res.end(JSON.stringify({ code: 200, message: '添加成功' }));
}

function deleteBook(res, query) {
    res.writeHeader(200, { 'Content-Type': 'application/json' });

    query = querystring.parse(query);
    var id = query.id;

    books = books.filter(function(book) {
        return book.id !== id;
    });

    res.end(JSON.stringify({ code: 200, message: '删除成功' }));
}

function bookDetail(res, query) {
    res.writeHeader(200, { 'Content-Type': 'application/json' });

    query = querystring.parse(query);
    var id = query.id;

    var book = books.filter(function(book) {
        return book.id === id;
    });

    res.end(JSON.stringify({ code: 200, data: book }));
}

var server = http.createServer(function(req, res) {
    var p_url = url.parse(req.url);
    var pathname = p_url.pathname;
    var query = p_url.query;

    var h = '';
    switch(pathname) {
        case '/': 
        case '/add':
        case '/detail':
            pathname = pathname.substr(1);
            h = htmlMap[pathname];
            getHtml(res, h);
            break;
        case '/books': 
            getBooks(res);
            break;
        case '/delete': 
            deleteBook(res, query);
            break;
        case '/book/add':
            addBook(req, res);
            break;
        case '/book/detail':
            bookDetail(res, query);
            break;
        default: 
            getHtml(res, '404.html');
            break;
    }
});

server.on('error', function(err) {
    console.log(err);
});

server.on('clientError', function(err, socket) {
    socket.end('\n 404 Bad Request \r\n\n');
});

server.listen(port, host, function() {
    getBooksFromJD();
    console.log('server start at port 3000');
});
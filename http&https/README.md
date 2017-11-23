## 简单的图书馆

这个例子中用到了一些模块都是`nodejs`内部的模块，如`http`/`url`/`fs`/`querystring`,下面主要介绍`url`与`querystring`，`fs`模块在文件模块中再具体分析

运行方式：

```javascript
npm install
supervisor index.js
localhost:3000
```

**注：所有的API可以去[官方API](http://nodejs.cn/api/url.html)去查看，这里不会全部介绍**

### URL

一个 URL 字符串是一个结构化的字符串，它包含多个有意义的组成部分。 当被解析时，会返回一个 URL 对象，它包含每个组成部分作为属性。

一个完整的URL可能是这样的 ''http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash''：

```javascript
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            href                                             │
├──────────┬──┬─────────────────────┬─────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │        host         │           path            │ hash  │
│          │  │                     ├──────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │   hostname   │ port │ pathname │     search     │       │
│          │  │                     │              │      │          ├─┬──────────────┤       │
│          │  │                     │              │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │   hostname   │ port │          │                │       │
│          │  │          │          ├──────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │        host         │          │                │       │
├──────────┴──┼──────────┴──────────┼─────────────────────┤          │                │       │
│   origin    │                     │       origin        │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴─────────────────────┴──────────┴────────────────┴───────┤
│                                            href                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

- url.parse(urlString[, parseQueryString[, slashesDenoteHost]])

url.parse() 方法会解析一个 URL 字符串并返回一个 URL 对象。

`urlString` *string* 要解析的URL字符串

`parseQueryString` *boolean* 如果为 true，则 query 属性总会通过 querystring 模块的 parse() 方法生成一个对象。 如果为 false，则返回的 URL 对象上的 query 属性会是一个未解析、未解码的字符串。 默认为 false。

`slashesDenoteHost` *boolean*  如果为 true，则 // 之后至下一个 / 之前的字符串会被解析作为 host。 例如，//foo/bar 会被解析为 {host: 'foo', pathname: '/bar'} 而不是 {pathname: '//foo/bar'}。 默认为 false。

```javascript
var url = require('url');
var test_url = 'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash';

/**
 * parse
 * @type {number|*}
 */
var my_url = url.parse(test_url);
console.log(my_url);

/*
 UrlObject

 Url {
  protocol: 'http:',
  slashes: true,
  auth: 'user:pass',
  host: 'sub.host.com:8080',
  port: '8080',
  hostname: 'sub.host.com',
  hash: '#hash',
  search: '?query=string',
  query: 'query=string',
  pathname: '/p/a/t/h',
  path: '/p/a/t/h?query=string',
  href: 'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash' }
*/
```

`parseQueryString`为`true`

```javascript
var my_url2 = url.parse('http://localhost:3000/book?id=efdsaf-ddls-d2dd-ddsaf', true);
console.log(my_url2);

/*
 Url {
    // ...
    query: { id: 'efdsaf-ddls-d2dd-ddsaf' }
    // ...
 }
 */
```

`slashesDenoteHost`为`true`

```javascript
var my_url5 = url.parse('//foo/bar');
var my_url6 = url.parse('//foo/bar', true, true);
console.log(my_url5.host);      // null
console.log(my_url5.pathname);  // //foo/bar
console.log(my_url5.path);      // // foo/bar
console.log(my_url6.host);      // foo
console.log(my_url6.pathname);  // /bar
console.log(my_url6.path);      // /bar
```

- url.format(urlObject)

url.format() 方法返回一个从 urlObject 格式化后的 URL 字符串。是 url.parse()的逆向操作

`urlObject` 类似于`url.parse()`返回的对象一样，如果是字符串，则先通过`url.parse()`转化为`urlObject`对象

```javascript
var urlObj = {
    protocol: 'http',
    slashes: true,
    auth: 'ryn:pass',
    host: 'localhost:3000',
    port: '3000',
    hostname: 'localhost',
    hash: '#test',
    search: '?name=ryn',
    query: 'name=ryn',
    pathname: '/book/find',
    path: '/book/find?name=ryn'
}

// http://ryn:pass@localhost:3000/book/find?name=ryn#test
console.log(url.format(urlObj));
```

### querystring

querystring 模块提供了一些实用函数，用于解析与格式化 URL 查询字符串。 使用以下方法引入：

```javascript
var querystring = require('querystring');
```

- escape(str)

对给定的 str 进行 URL 编码，效果同 `encodeURIComponent`

```javascript
var querystring = require('querystring');
var query = 'name=尼古拉斯哲';

// name%3D%E5%B0%BC%E5%8F%A4%E6%8B%89%E6%96%AF%E5%93%B2
console.log(querystring.escape(query));
console.log(encodeURIComponent(query));
```

- unescape(str)

对给定的 str 进行解码。效果同`decodeURIComponent`

```javascript
var querystring = require('querystring');
var query = 'name%3D%E5%B0%BC%E5%8F%A4%E6%8B%89%E6%96%AF%E5%93%B2';

// name=尼尼古古拉拉斯斯哲哲
console.log(querystring.unescape(query));
console.log(decodeURIComponent(query));
```

- parse(str[, sep[, eq[, options]]])

`obj` *Object* 要解析的对象

`sep` *string* 用于界定查询字符串中的键值对的子字符串。默认为'&'

`eq` *string* 用于界定查询字符串中的键与值的子字符串。默认为`=`

```javascript
/*
    var obj = {
        name: 'ryn',
        hobbies: ['draw', 'read', 'game'],
        love: 'girl'
    };
 */
console.log(querystring.parse('name=ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl', '*'));

// { name: 'ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl' }
console.log(querystring.parse('name=ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl'));
```

- stringify(obj[, sep[, eq[, options]]])

`obj` *Object* 要解析的对象

`sep` *string* 用于界定查询字符串中的键值对的子字符串。默认为'&'

`eq` *string* 用于界定查询字符串中的键与值的子字符串。默认为`=`

```javascript
var obj = {
    name: 'ryn',
    hobbies: ['draw', 'read', 'game'],
    love: 'girl'
};

// name=ryn&hobbies=draw&hobbies=read&hobbies=game&love=girl
console.log(querystring.stringify(obj));
// name=ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl
console.log(querystring.stringify(obj, '*'));
// name-ryn*hobbies-draw*hobbies-read*hobbies-game*love-girl
console.log(querystring.stringify(obj, '*', '-'));
```

### HTTP

`http`模块中的明星函数莫过于`createServer`， 这个函数可以让我们快速地返回一个迷你服务器，类似这样的：

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
    res.end('Hello world!');
});

server.listen(3000, '127.0.0.1', function() {
    console.log('server start on 127.0.0.1:3000');
});
```

使用`node`运行这段函数之后，就可以在浏览器中输入`localhost:3000`来打开一个页面。其中，`req`是`node`中的标准输入流，`res`是标准可写流。关于这两个对象中的其他方式可以去中文网上去看 [http://nodejs.cn/api/http.html](http://nodejs.cn/api/http.html)

常用到的方法： 

```javascript
requset.getHeader()
request.write()
request.end()
request.socket

response.writeHeader()
response.write()
response.socket
response.end()
response.finished

server.listen()
server.close()
```

**关于中间件**

在请求到达和返回之前我们可能需要做一系列的操作，而这些操作上抽象出来的一些方法，在`node`中我们就可以把它叫做中间件。例如：上面的一个经典的迷你服务器的例子中：

```javascript
http.createServer(requestHandler);

function requestHandler(req, res) {
    // 1. 存在是否有请求体，若存在，则去解析
    // 2. 解析请求体中是否有对应参数，如果有则去数据库查询
    // 3. 返回请求数据库之后解析的数据
}
```

那么，上面的实现按照金字塔的方法，可能是这样实现的：

```javascript

// 解析请求体
function parseBody(req, cb) {
    var body = parse(req);
    cb(null, body);
}

// 查询数据
function checkInDataBase(body, cb) {
    var data = databaseLookUp(body.id);
    cb(null, data);
}

// 处理数据
function returnResult(data, res) {
    if (data.length > 0) {
        res.end(JSON.stringify(data));
    } else {
        res.end('[]');
    }
}

function requestHandler(req, res) {
    parseBody(req, function(err, body) {
        checkInDataBase(body, function(err, data) {
            returnResult(data, res);
        })
    })
}

```

这就是基于回调的金字塔模型，可见如果嵌套的层次过多，代码将会十分丑陋。解决这类问题主要有以下几类方式：

- Promise

- Async

- Generator

关于`Promise`讲解，具体可以去这里看[http://es6.ruanyifeng.com/#docs/promise](http://es6.ruanyifeng.com/#docs/promise)

下面来讲讲如何用`Async`和`Generator`实现

```javascript
// Promise

function fun1(req) {
    return new Promise(function(resolve, reject) {
        parseBody(req, function(err, body) {
            if (err) {
                reject(err);
            }

            resolve(body);
        });
    });
}

function fun2(req, body) {
    return new Promise(function(resolve, reject) {
        checkInDataBase(body.id, function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

function fun3(data, res) {
    if (data.length > 0) {
        res.end(JSON.stringify(data));
    } else {
        res.end('[]');
    }
}

function requestHandler(req, res) {
    fun1(req).then(function(body) {
        fun2(req, body).then(function(data) {
            fun3(data, res);
        })
    });
}
```

```javascript
// Async

var middlewares = [
    function fun1(req, res, next) {
        parseBody(req, function(err, body) {
            if (err) {
                next(err);
            }
            req.body = body;
            next();
        })
    },
    function fun2(req, res, next) {
        checkInDataBase(req.body.id, function(err, data) {
            if (err) {
                next(err);
            }

            res.data = data;
            next();
        });
    },
    function fun3(req, res, next) {
        returnResult(res.data, res);
        next();
    }
];

function requestHandler(req, res) {
    var i = 0;

    function next(err) {
        // 遇到一个错误即终止
        if (err) {
            return res.end('error', err.toString());
        }

        if (i < middlewares.length) {
            middlewares[++i](req, res, next);
        }
    }

    // 首先触发第一个next
    next();
}
```

```javascript
// Generator + Promise

function requestHandler(req, res) {
    function * followControl() {
        // 注意此中 yield 之后的都是 Promise
        // 例子可以参看文件夹中 http&https/connect/generator-demo.js

        var body = yield parse(req);
        yield checkInDataBase(body);
    }

    var work = followControl();
    work.next().value.then(function(body) {
        work.next(body).value.then(function(data) {
            var data = work.next(body);
            if (data && data.length > 0) {
                res.end(JSON.stringify(data));
            } else {
                res.end('[]');
            }
        })
    })
}

```

### superagent

> SuperAgent is a small progressive client-side HTTP request library, and Node.js module with the same API, sporting many high-level HTTP client features

`superagent`可以在客户端发生请求，是`http.request`的具体封装。相对与`http.request`来说提供了更好的操作性。

```javascript
npm install superagent
```

```javscript
request
  .post('/api/pet')
  .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
  });
```

### cheerio

可以把一个`html`的字符串构建成一个dom树，同时提供了类似与`jquery`相同的API，因此我们很方便地能够获取`html`字符串中相应的值，例如：

```javscript
npm install cheerio
```

```javascript
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

$.html()
//=> <h2 class="title welcome">Hello there!</h2>
```

### node-supervisor

> Node Supervisor is used to restart programs when they crash.
  It can also be used to restart programs when a *.js file changes.

这个npm包作用主要是监控文件变化，如果一个文件变化之后，将会重启服务器。

```javascript
npm install supervisor
```

```javascript
Usage:
  supervisor [options] <program>
  supervisor [options] -- <program> [args ...]
```


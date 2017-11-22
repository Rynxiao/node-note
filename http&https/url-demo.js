var url = require('url');
var test_url = 'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash';

/**
 * parse
 * @type {number|*}
 */
var my_url = url.parse(test_url);
console.log(my_url);

/*
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

var my_url2 = url.parse('http://localhost:3000/book?id=efdsaf-ddls-d2dd-ddsaf', true);
console.log(my_url2);

/*
 Url {
    // ...
    query: { id: 'efdsaf-ddls-d2dd-ddsaf' }
    // ...
 }
 */

var my_url5 = url.parse('//foo/bar');
var my_url6 = url.parse('//foo/bar', true, true);
console.log(my_url5.host);      // null
console.log(my_url5.pathname);  // //foo/bar
console.log(my_url5.path);      // // foo/bar
console.log(my_url6.host);      // foo
console.log(my_url6.pathname);  // /bar
console.log(my_url6.path);      // /bar

/**
 * format
 * @type {number|*}
 */
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

console.log(url.format(urlObj));    // http://ryn:pass@localhost:3000/book/find?name=ryn#test

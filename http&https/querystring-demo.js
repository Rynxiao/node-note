/**
 * Created by RYN on 2017/11/22.
 */

var querystring = require('querystring');
var query = 'name=尼古拉斯哲';

// name%3D%E5%B0%BC%E5%8F%A4%E6%8B%89%E6%96%AF%E5%93%B2
console.log(querystring.escape(query));

// name%3D%E5%B0%BC%E5%8F%A4%E6%8B%89%E6%96%AF%E5%93%B2
console.log(encodeURIComponent(query));

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

var query2 = 'name%3D%E5%B0%BC%E5%8F%A4%E6%8B%89%E6%96%AF%E5%93%B2';

// name=尼尼古古拉拉斯斯哲哲
console.log(querystring.unescape(query2));
console.log(decodeURIComponent(query2));

/*
    {
        name: 'ryn',
        hobbies: [ 'draw', 'read', 'game' ],
        love: 'girl'
    }
 */
console.log(querystring.parse('name=ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl', '*'));

// { name: 'ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl' }
console.log(querystring.parse('name=ryn*hobbies=draw*hobbies=read*hobbies=game*love=girl'));
var buf = Buffer.alloc(5, 'a');

// <Buffer 61 61 61 61 61>
console.log(buf);

var buf1 = Buffer.alloc(4, 'abcd=');

// <Buffer 61 62 63 64>
// 超过部分自动舍弃
console.log(buf1);

var buf2 = Buffer.alloc(11, 'abcdefghi=', 'hex');

// <Buffer ab cd ef ab cd ef ab cd ef ab cd>
console.log(buf2);

//--------------------------
//      byteLength
//      (string, encoding)
//--------------------------

const str = '\u00bd + \u00bc = \u00be';

// ½ + ¼ = ¾: 9 个字符, 12 个字节
console.log(`${str}: ${str.length} 个字符, ` +
    `${Buffer.byteLength(str, 'utf8')} 个字节`);

//--------------------------
//      compare
//--------------------------

const cbuf1 = Buffer.from('1234');
const cbuf2 = Buffer.from('0123');
const arr = [cbuf1, cbuf2];

// 输出: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (结果相当于: [cbuf2, cbuf1])
console.log(arr.sort(Buffer.compare));

//--------------------------
//      concat
//      (list, totalLength)
//--------------------------

const buf11 = Buffer.alloc(10);
const buf21 = Buffer.alloc(14);
const buf31 = Buffer.alloc(18);
const totalLength = buf11.length + buf21.length + buf31.length;

// 42
console.log(totalLength);

const bufA = Buffer.concat([buf11, buf21, buf31], totalLength);

// <Buffer 00 00 00 00 ...>
console.log(bufA);

// 42
console.log(bufA.length);

//--------------------------
//      isBuffer
//--------------------------

const buff1 = Buffer.alloc(5);

// true
console.log(Buffer.isBuffer(buff1));
// false
console.log(Buffer.isBuffer({}));

//--------------------------
//      isEncoding
//--------------------------

/*
    Node.js 目前支持的字符编码包括：

    'ascii' - 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。

    'utf8' - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。

    'utf16le' - 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。

    'ucs2' - 'utf16le' 的别名。

    'base64' - Base64 编码。当从字符串创建 Buffer 时，按照 RFC4648 第 5 章的规定，这种编码也将正确地接受“URL 与文件名安全字母表”。

    'latin1' - 一种把 Buffer 编码成一字节编码的字符串的方式（由 IANA 定义在 RFC1345 第 63 页，用作 Latin-1 补充块与 C0/C1 控制码）。

    'binary' - 'latin1' 的别名。

    'hex' - 将每个字节编码为两个十六进制字符。

    注意：现代浏览器遵循 WHATWG 编码标准 将 'latin1' 和 ISO-8859-1 别名为 win-1252。 这意味着当进行例如 http.get() 这样的操作时，如果返回的字符编码是 WHATWG 规范列表中的，则有可能服务器真的返回 win-1252 编码的数据，此时使用 'latin1' 字符编码可能会错误地解码数据。
 */

// true
console.log(Buffer.isEncoding('hex'));

// false
console.log(Buffer.isEncoding('gbk'));


//--------------------------
//      buffer[index]
//--------------------------

/*
    索引操作符 [index] 可用于获取或设置 buf 中指定 index 位置的八位字节。 这个值指向的是单个字节，所以合法的值范围是的 0x00 至 0xFF（十六进制），或 0 至 255（十进制）。

    该操作符继承自 Uint8Array，所以它对越界访问的处理与 UInt8Array 相同（也就是说，获取时返回 undefined，设置时什么也不做）。
 */
const istr = 'Node.js';
const ibuf = Buffer.allocUnsafe(istr.length);

for (let i = 0; i < istr.length; i++) {
    ibuf[i] = istr.charCodeAt(i);
}

// Node.js
console.log(ibuf.toString('ascii'));

//--------------------------
//      equals
//      (otherBuffer)
//--------------------------

const ebuf1 = Buffer.from('ABC');
const ebuf2 = Buffer.from('414243', 'hex');
const ebuf3 = Buffer.from('ABCD');

// true
console.log(ebuf1.equals(ebuf2));

// false
console.log(ebuf1.equals(ebuf3));

//--------------------------
//      buffer.write()
//      (string[, offset[, length]][, encoding])
//      string <string> 要写入 buf 的字符串。
//      offset <integer> 开始写入 string 前要跳过的字节数。默认: 0。
//      length <integer> 要写入的字节数。默认: buf.length - offset。
//      encoding <string> string 的字符编码。默认: 'utf8'。
//      返回: <integer> 写入的字节数。
//--------------------------

const wbuf = Buffer.allocUnsafe(256);

const wlen = wbuf.write('\u00bd + \u00bc = \u00be', 0);

// 12 个字节: ½ + ¼ = ¾
console.log(`${wlen} 个字节: ${wbuf.toString('utf8', 0, wlen)}`);

//--------------------------
//      buf.toString()
//      ([encoding[, start[, end]]])
//      encoding <string> 解码使用的字符编码。默认: 'utf8'
//      start <integer> 开始解码的字节偏移量。默认: 0
//      end <integer> 结束解码的字节偏移量（不包含）。 默认: buf.length
//      返回: <string>
//--------------------------

const buft = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值
  buft[i] = i + 97;
}

// 输出: abcdefghijklmnopqrstuvwxyz
console.log(buft.toString('ascii'));

// 输出: abcde
console.log(buft.toString('ascii', 0, 5));


const buft2 = Buffer.from('tést');

// 输出: 74c3a97374
console.log(buft2.toString('hex'));

// 输出: té
console.log(buft2.toString('utf8', 0, 3));

// 输出: té
console.log(buft2.toString(undefined, 0, 3));



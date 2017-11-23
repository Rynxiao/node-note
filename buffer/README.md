## Buffer

### buffer的应用场景

基于`TCP`传输的时候都需要用到缓冲池，这点后端的童鞋应该都不陌生。所谓的缓冲池，其实就是内存中的一块区域，可以写入数据，也可以读出数据。通过一定的策略使得这块区域能够作为数据的中转站，这就达到了缓冲的目的。

互联网中的数据传输都是通过二进制流的形式传递的，所谓的二进制流就是你所看到的'0001001'形式的二进制码，在平常`js`的操作中，我们可能根本就不会同这个东西打交道，而引入`buffer`的概念也是在`EMCAScript 2015`之后才被引入的，处理的就是一些特殊的数据。比如音频、文件、socket传输等等

`Buffer` 类的实例类似于整数数组，但 `Buffer` 的大小是固定的、且在 V8 堆外分配物理内存。 `Buffer` 的大小在被创建时确定，且无法调整。

`Buffer` 类在 Node.js 中是一个全局变量，因此无需使用 `require('buffer').Buffer`。

```javascript
// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10、且未初始化的 Buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill() 或 write() 重写。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf6 = Buffer.from('tést', 'latin1');
```

### Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe()

在 Node.js v6 之前的版本中，Buffer 实例是通过 Buffer 构造函数创建的，它根据提供的参数返回不同的 Buffer：

- 传一个数值作为第一个参数给 Buffer()（如 new Buffer(10)），则分配一个指定大小的新建的 Buffer 对象。 在 Node.js 8.0.0 之前，分配给这种 Buffer 实例的内存是没有初始化的，且可能包含敏感数据。 这种 Buffer 实例随后必须被初始化，可以使用 buf.fill(0) 或写满这个 Buffer。 虽然这种行为是为了提高性能而有意为之的，但开发经验表明，创建一个快速但未初始化的 Buffer 与创建一个慢点但更安全的 Buffer 之间需要有更明确的区分。从 Node.js 8.0.0 开始， Buffer(num) 和 new Buffer(num) 将返回一个初始化内存之后的 Buffer。

- 传一个字符串、数组、或 Buffer 作为第一个参数，则将所传对象的数据拷贝到 Buffer 中。

- 传入一个 ArrayBuffer，则返回一个与给定的 ArrayBuffer 共享所分配内存的 Buffer。

因为 new Buffer() 的行为会根据所传入的第一个参数的值的数据类型而明显地改变，所以如果应用程序没有正确地校验传给 new Buffer() 的参数、或未能正确地初始化新分配的 Buffer 的内容，就有可能在无意中为他们的代码引入安全性与可靠性问题。

为了使 Buffer 实例的创建更可靠、更不容易出错，各种 new Buffer() 构造函数已被 废弃，并由 Buffer.from()、Buffer.alloc()、和 Buffer.allocUnsafe() 方法替代。

开发者们应当把所有正在使用的 new Buffer() 构造函数迁移到这些新的 API 上。

- Buffer.from(array) 返回一个新建的包含所提供的字节数组的副本的 Buffer。

- Buffer.from(arrayBuffer[, byteOffset [, length]]) 返回一个新建的与给定的 ArrayBuffer 共享同一内存的 Buffer。

- Buffer.from(buffer) 返回一个新建的包含所提供的 Buffer 的内容的副本的 Buffer。

- Buffer.from(string[, encoding]) 返回一个新建的包含所提供的字符串的副本的 Buffer。

- Buffer.alloc(size[, fill[, encoding]]) 返回一个指定大小的被填满的 Buffer 实例。 这个方法会明显地比 Buffer.allocUnsafe(size) 慢，但可确保新创建的 Buffer 实例绝不会包含旧的和潜在的敏感数据。

- Buffer.allocUnsafe(size) 与 Buffer.allocUnsafeSlow(size) 返回一个新建的指定 size 的 Buffer，但它的内容必须被初始化，可以使用 buf.fill(0) 或完全写满。

如果 size 小于或等于 Buffer.poolSize 的一半，则 Buffer.allocUnsafe() 返回的 Buffer 实例可能会被分配进一个共享的内部内存池。

```javascript
const arr = new Uint8Array(2);

arr[0] = 1;
arr[1] = 2;

// [object Uint8Array]
console.log(Object.prototype.toString.call(arr));

// [object ArrayBuffer]
console.log(Object.prototype.toString.call(arr.buffer));

// 拷贝 `arr` 的内容
const buf1 = Buffer.from(arr);

// 与 `arr` 共享内存
const buf2 = Buffer.from(arr.buffer);

// 输出: <Buffer 01 02>
console.log(buf1);

// 输出: <Buffer 01 02>
console.log(buf2);

arr[1] = 3;

// 输出: <Buffer 01 02>
console.log(buf1);

// 输出: <Buffer 01 03>
console.log(buf2);
```

### Buffer.allocUnsafe() 与 Buffer.allocUnsafeSlow() 不安全

以这种方式创建的 Buffer 实例的底层内存是未初始化的。 新创建的 Buffer 的内容是未知的，且可能包含敏感数据。

```javascript
var buf = Buffer.allocUnsafe(10);

// <Buffer c0 23 80 04 01 00 00 00 a8 23>
console.log(buf);

buf.fill(0);

// <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf);
```
### Buffer常规操作

更多请参看[CNode Buffer](http://nodejs.cn/api/buffer.html)

```javascript
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

```







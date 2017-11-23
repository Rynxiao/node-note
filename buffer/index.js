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

var buf = Buffer.allocUnsafe(10);

// <Buffer c0 23 80 04 01 00 00 00 a8 23>
console.log(buf);

buf.fill(0);

// <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf);
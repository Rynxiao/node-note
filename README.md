# node学习笔记

## 安装node

`windows`和`os Mac`下直接到[官网](https://nodejs.org/en/download/)或者[https://nodejs.org/download/release/](https://nodejs.org/download/release/)这里去下载对应版本，`windows`下载`.msi`的安装文件，`mac`下载`.pkg`的文件，直接安装运行即可

`linux`上采用源代码的安装方式：
 
- g++ version > 4.6, python version > 2.6
- 下载`.tar.gz`的对应版本到某个目录下

```javascript
> cd somewhere
> ./configure
> make
> sudo make install
```
安装完成之后，在控制台输入如下命令，如果出现版本号，就说明已经安装成功了

```javascript
node -v
> v7.9.0

npm -v
> v5.0.3
```
## 目录

[安装包](https://github.com/Rynxiao/node-note/tree/master/install)

[事件](https://github.com/Rynxiao/node-note/tree/master/events)

[buffer缓冲](https://github.com/Rynxiao/node-note/tree/master/buffer)

[小小图书馆](https://github.com/Rynxiao/node-note/tree/master/http%26https)

[简易聊天室](https://github.com/Rynxiao/node-note/tree/master/net)


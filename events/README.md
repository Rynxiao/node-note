## 事件

了解`nodejs`的事件驱动模型

在网上找了很多资料，说得都含糊其词，一点都不清楚，后来发现了[理解Node.js事件驱动编程](https://www.cnblogs.com/lua5/archive/2011/02/01/1948760.html)这篇文章，文章和评论都很精彩。

### 两个例子

第一个例子是关于医生看病。

在美国去看医生，需要填写大量表格，比如保险、个人信息之类，传统的基于线程的系统（thread-based system），接待员叫到你，你需要在前台填写完成这些表格，你站着填单，而接待员坐着看你填单。你让接待员没办法接待下一个客户，除非完成你的业务。

想让这个系统能运行的快一些，只有多加几个接待员，人力成本需要增加不少。

基于事件的系统（event-based system）中，当你到窗口发现需要填写一些额外的表格而不仅仅是挂个号，接待员把表格和笔给你，告诉你可以找个座位填写，填完了以后再回去找他。你回去坐着填表，而接待员开始接待下一个客户。你没有阻塞接待员的服务。

你填完表格，返回队伍中，等接待员接待完现在的客户，你把表格递给他。如果有什么问题或者需要填写额外的表格，他给你一份新的，然后重复这个过程。

这个系统已经非常高效了，几乎大部分医生都是这么做的。如果等待的人太多，可以加入额外的接待员进行服务，但是肯定要比基于线程模式的少得多。

第二个例子是快餐店点餐。

在基于线程的方式中（thread-based way）你到了柜台前，把你的点餐单给收银员或者给收银员直接点餐，然后等在那直到你要的食物准备好给你。收银员不能接待下一个人，除非你拿到食物离开。想接待更多的客户，容易！加更多的收银员！

当然，我们知道快餐店其实不是这样工作的。他们其实就是基于事件驱动方式，这样收银员更高效。只要你把点餐单给收银员，某个人已经开始准备你的食物，而同时收银员在进行收款，当你付完钱，你就站在一边而收银员已经开始接待下一个客户。在一些餐馆，甚至会给你一个号码，如果你的食物准备好了，就呼叫你的号码让你去柜台取。关键的一点是，你没有阻塞下一个客户的订餐请求。你订餐的食物做好的事件会导致某个人做某个动作（某个服务员喊你的订单号码，你听到你的号码被喊到去取食物），在编程领域，我们称这个为回调（callback function）。

### NIO

其实就是nio（node。js是nio）和bio（很少主流的通信服务器后端还是bio的） bio基本不用考虑 aio（iis的基础通信模式 应该就是一种aio）的区别

node。js进来的请求 首先任务排队，这时候并不占用cpu 只是占用内存队列，然后主线程操作到某个任务，而任务所谓的事件驱动可以看作一种后台驱动，说白了就是有一个专门的后台线程池专门做这个事情，而前台主线程就是递交给这个后台线程池的任务队列而已

说白了就是队列来队列去

据我所知某个版本的node。js 就是 一个主线程 处理请求的基本信息 然后一个后台线程池 默认只有4个线程的大小 进行事件驱动中的所谓异步，所谓的异步就是某个请求要处理大量逻辑的时候，语法发起一个异步行为以后自动排队到异步任务队列，然后会在任务被处理外以后发送事件结果并且恢复当初的请求逻辑 继续执行 等这一连串机制

nio是前端一个处理线程

aio 比如iis 是前端多个处理线程 整体一个处理用的线程池

iis默认性能不如nio 就是因为默认代码逻辑工作在第一级这个线程池，而实际上可以释放第一层iis线程池，而使用第二层级线程池 这里面就是关键
当你学会释放当前工作线程池等待后台线程池慢慢处理任务 iis的性能就完全不会输给node。js了 。net早起其实就能够完成挂起 只是比较麻烦 。net4.x开始 其实就已经可以很好的简单靠 await async等2个新关键字 以及Task 新的全局线程池封装 来简单释放iis的请求处理工作线程池 以提高整个吞吐效率

关键就在于 webserver怎么大量让很多任务都处于第一层挂起 第二层等待中，而保证第一层的请求处理可以挂起 似乎是其关键

### 简易的消息订阅实现

```javascript
var Event = (function() {
    var list = {}, listen, trigger, remove;

    listen = function(key, fn) {
        if (!list[key]) {
            list[key] = [];
        }

        list[key].push(fn);
    };

    trigger = function() {
        var key = Array.prototype.shift.call(arguments);
        var fns = list[key];

        if (!fns || fns.length === 0) {
            return;
        }

        for (var i = 0; i < fns.length; i++) {
            var fn = fns[i];
            fn.apply(this, arguments);
        }
    };

    remove = function(key, fn) {
        var fns = list[key];
        if (!fns) {
            return false;
        }

        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var i = 0; i < fns.length; i++) {
                var _fn = fns[i];
                if (_fn === fn) {
                    fns.splice(i, 1);
                }
            }
        }
    }

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    };
})();

Event.listen('message', function(word) {
    console.log('I receive a message says: ' + word);
});

Event.listen('game', function(gameName) {
    console.log('I will to play the game of name: ' + gameName);
});

Event.trigger('message', 'Hello world');
Event.trigger('game', 'KOF');
```

### API

所有能触发事件的对象都是 EventEmitter 类的实例。 这些对象开放了一个 eventEmitter.on() 函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。 事件名称通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性名。

当 EventEmitter 对象触发一个事件时，所有绑定在该事件上的函数都被**同步地调用**。 监听器的返回值会被丢弃。

主要方法：

- emit(eventName[, ...args])

按监听器的注册顺序，同步地调用每个注册到名为 eventName 事件的监听器，并传入提供的参数。

```javascript
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
```

- on(eventName, listener)

添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 和 listener 会导致 listener 被添加与调用多次。

```javascript
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
```

- once(eventName, listener)

添加一个单次 listener 函数到名为 eventName 的事件。 下次触发 eventName 事件时，监听器会被移除，然后调用。

```javascript
myEE.once('bar', function() {
    console.log('bar 1');
});

// bar 1
myEE.emit('bar');
myEE.emit('bar');
```









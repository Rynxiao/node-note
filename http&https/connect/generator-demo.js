function fun1() {
    return new Promise(function(resolve, reject) {
        var body = { id: 0 };
        setTimeout(function() {
            body.id = 1;
            resolve(body);
        }, 2000);
    }); 
}

function fun2(body) {
    console.log('body.id', body.id);
    return new Promise(function(resolve, reject) {
        var data = [1];
        setTimeout(function() {
            data.push(2)
            resolve(data);
        }, 2000);
    }); 
}

function * rangeOnToThree() {
    yield 1;

    console.log('test 1 - 2');

    yield 2;

    console.log('test 2 - 3');

    yield 3;
}

var work = rangeOnToThree();

// { value: 1, done: false }
// test 1 - 2
// { value: 2, done: false }
// test 2 - 3
// { value: 3, done: false }
console.log(work.next());
console.log(work.next(1));
console.log(work.next());

function * test() {
    var body = yield fun1();

    console.log(body); 

    yield fun2(body);
}

// { id: 1 }
// body.id 1
// data [ 1, 2 ]
// [1,2]
var t = test();
t.next().value.then(function(body) {
    t.next(body).value.then(function(data) {
        console.log('data', data);
        if (data && data.length > 0) {
            console.log(JSON.stringify(data));
        }
    })
})

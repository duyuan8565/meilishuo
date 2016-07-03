~function (pro) {
    function bind(context) {
        if ("bind" in pro) {
            return this.bind.apply(this, arguments);
        }
        var _this = this,
            outerArg = [].slice.call(arguments, 1);
        return function () {
            var innerArg = [].slice.call(arguments, 0);
            _this.apply(context, outerArg.concat(innerArg));
        }
    }

    pro.myBind = bind;
}(Function.prototype);

function bind(curEle, type, fn) {
    if (curEle.addEventListener) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var tempFn = fn.myBind(curEle);
    tempFn.photo = fn;
    !curEle["myBind" + type] ? curEle["myBind" + type] = [] : null;
    var ary = curEle["myBind" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].photo === fn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}

//给当前某一个元素绑定的方法移除
function unbind(curEle, type, fn) {
    if (curEle.removeEventListener) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var ary = curEle["myBind" + type];
    if (ary && ary instanceof Array) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            if (curFn.photo === fn) {
                curEle.detachEvent("on" + type, curFn);
                ary.splice(i, 1);//移除自定义属性中存储的问题
                break;
            }
        }
    }
}

/*---------------------------------------------解决顺序问题*/
function on(curEle, type, fn) {
    !curEle["myEvent" + type] ? curEle["myEvent" + type] = [] : null;
    var ary = curEle["myEvent" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            return;
        }
    }
    ary.push(fn);
    bind(curEle, type, run);
}
//从自定义属性池里把指定的方法移除
function off(curEle, type, fn) {
    var ary = curEle["myEvent" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            if (curFn === fn) {
                ary[i] = null;
                return;
            }
        }
    }
}
//唯一给当前元素的某个行为在内置事件池中唯一一个绑定的方法，当行为触发执行run方法我们在run方法中分别把存储在自己容器的所有方法一次执行
function run(ev) {
    ev = ev || window.event;
    if (!ev.target) {
        ev.target = ev.srcElement;
        ev.pageX = ev.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        ev.pageY = ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        ev.preventDefault = function () {
            ev.returnValue = false;
        };
        ev.stopPropagation = function () {
            ev.cancelBubble = true;
        };
    }
    var ary = this["myEvent" + ev.type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            if (typeof curFn === "function") {
                curFn.call(this, ev);//让ie保持想标准浏览器一样 事件对象是以参数的方式传进来
                continue;
            }
            //->我们在执行的时候把数组中非函数这一项给删除掉
            ary.splice(i, 1);
            i--;
        }
    }
}

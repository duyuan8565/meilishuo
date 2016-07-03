/**
 * Created by Administrator on 2016/6/12 0012.
 */

//搜索框点击事件
var oSearch = document.getElementById("search");
var oInput = oSearch.getElementsByTagName("input")[0];
var searchTab = document.getElementById("search_tab");
var oSpan = searchTab.getElementsByTagName("span");
for (var i = 0; i < oSpan.length; i++) {
    oSpan[i].onclick = function () {
        for (var j = 0; j < oSpan.length; j++) {
            oSpan[j].className = '';
        }
        this.className = 'activ';
        if (this.innerHTML == "店铺") {
            oInput.placeholder = '';
        } else {
            oInput.placeholder = '给我连衣裙，美翻全世界';
        }
    }
}
//搜索框点击事件结束。
//热词轮播左边开始
var oDiv = document.getElementById("top_wrap");
var oLis = utils.getByClass(oDiv, "list");
for (var i = 0; i < oLis.length; i++) {
    oLis[i].onmouseover = function () {
        //console.log(utils.getByClass(this,"nav_list")[0])
        utils.getByClass(this, "nav_list")[0].style.display = "block";
    }
    oLis[i].onmouseout = function () {
        utils.getByClass(this, "nav_list")[0].style.display = "none";
    }
}
//热词轮播左边结束
//导航条定位
var oNav = document.getElementById("nav");
var oNavTop = oNav.offsetTop;

function scrollNav() {
    if (document.body.scrollTop >= oNavTop) {
        oNav.style.position = 'fixed';
        oNav.style.top = '0';
        oNav.style.left = '0';
    } else {
        oNav.style.position = 'relative';
        oNav.style.width = '100%';
    }
};

//导航条定位结束
//轮播图开始
var oBox = document.getElementById("box");
var oUl = oBox.getElementsByTagName("ul")[0];
var oLi = oUl.getElementsByTagName("li");
var oImg = oUl.getElementsByTagName("img");
var aDiv = oBox.getElementsByTagName("div")[0];
var aSpan = aDiv.getElementsByTagName("span");
var btnLeft = utils.children(oBox, "a")[0];
var btnRight = utils.children(oBox, "a")[1];
var autoTimer = null;
var interval = 3000;
var data = null;
//请求数据
getData();
function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "json/data.txt?_=" + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}
//绑定数据
bind();
function bind() {
    var str = '';
    var str2 = '';
    for (var i = 0; i < data.length; i++) {
        str += '<li><a href="javascript:;" class="pic"><img src="" realImg="' + data[i].imgSrc + '" alt=""></a></li>'
        str2 += i === 0 ? '<span class="bg"></span>' : '<span></span>';
    }
    oUl.innerHTML = str;
    aDiv.innerHTML = str2;
}
//延迟加载
lazeImg();
function lazeImg() {
    for (var i = 0; i < oImg.length; i++) {
        (function (index) {
            var curImg = oImg[index];
            var aImg = new Image;
            aImg.src = oImg[i].getAttribute("realImg");
            aImg.onload = function () {
                curImg.src = this.src;
                aImg = null;
                utils.css(oLi[0], 'zIndex', 1);
                zhufengAnimate(oLi[0], {'opacity': 1}, 2000);
            }
        })(i)
    }
}
//自动轮播
var step = 0;
var autoTimer = window.setInterval(autoMove, interval);
function autoMove() {
    if (step >= oLi.length - 1) {
        step = -1;
    }
    step++;
    setBanner();
    bannerTip();
}
function setBanner() {
    for (var i = 0; i < oLi.length; i++) {
        var curLi = oLi[i];
        utils.css(curLi, 'zIndex', 0)
        if (i === step) {
            utils.css(curLi, 'zIndex', 1);
            zhufengAnimate(curLi, {"opacity": 1}, 2000, function () {
                var siblings = utils.siblings(this);
                for (var i = 0; i < siblings.length; i++) {
                    utils.css(siblings[i], 'opacity', 0)
                }
            });
            continue;
        }
    }
};
//焦点随图片轮播
function bannerTip() {
    for (var i = 0; i < aSpan.length; i++) {
        var curSpan = aSpan[i];
        i == step ? utils.addClass(curSpan, 'bg') : utils.removeClass(curSpan, "bg");
    }
};
//鼠标移入移出
stopStart();
function stopStart() {
    oBox.onmouseover = function () {
        clearInterval(autoTimer);
        utils.css(btnLeft, "display", "block");
        utils.css(btnRight, "display", "block");
    }
    oBox.onmouseout = function () {
        autoTimer = window.setInterval(autoMove, interval)
        utils.css(btnLeft, "display", "none");
        utils.css(btnRight, "display", "none");
    }
}
//点击焦点进行轮播
handleChange();
function handleChange() {
    for (var i = 0; i < aSpan.length; i++) {
        aSpan[i].index = i;
        aSpan[i].onclick = function () {
            clearInterval(autoMove);
            step = this.index;
            setBanner();
            for (var j = 0; j < aSpan.length; j++) {
                aSpan[j].className = ''
            }
            this.className = "bg";
        }
    }
}
//点击左右按钮切换
btnLeft.onclick = autoMove;
btnRight.onclick = function () {
    if (step <= 0) {
        step = oLi.length;
    }
    step--;
    setBanner();
}
//轮播图结束

//HI范儿选项卡部分
var oTab = document.getElementById("oTab");
var oFirst = oTab.getElementsByTagName("div");
var tabInner = utils.next(oTab, "tab_item");
var tab_inner = document.getElementById("tab_inner");
var tabItem = utils.children(tabInner, "div");
for (var i = 0; i < oFirst.length; i++) {
    oFirst[i].index = i;
    oFirst[i].onclick = function () {
        for (var j = 0; j < tabItem.length; j++) {
            oFirst[j].className = '';
            tabItem[j].className = 'tab_item';
        }
        this.className = "first";
        tabItem[this.index].className = "tab_item active";
    }
}
;
//HI范儿选项卡部分结束
//好店推荐开始选项卡
var tabs = document.getElementById("tabs");
var inner = document.getElementById("inner");
var aDivs = tabs.getElementsByTagName("div");
var items = utils.children(inner, 'div');
for (var i = 0; i < aDivs.length; i++) {
    aDivs[i].index = i;
    aDivs[i].onclick = function () {
        for (var k = 0; k < items.length; k++) {
            aDivs[k].className = '';
            items[k].className = "tab_item";
        }
        this.className = "first";
        items[this.index].className = "tab_item active";
    }
}
;
//好店推荐开始选项卡结束
//底部跑马灯
var slide = document.getElementById("slide");
var marginTop = 0;
var baseHeight = 20;
setInterval(function () {
    if (marginTop == '-' + baseHeight * 4) {
        slide.style.marginTop = '0px';
        marginTop = 0;
    }
    marginTop -= 20;
    zhufengAnimate(slide, {marginTop: marginTop}, 1000, 2)
}, 1500)

//右侧CSS3效果
var relative = document.getElementById("relative");
var sideOther = utils.children(relative, 'div')[1];
relative.onmouseover = function () {
    sideOther.style.webkitTransform = 'translate(-38px)';
};
relative.onmouseout = function () {
    sideOther.style.webkitTransform = 'translate(38px)';
};

//右侧返回顶部
var goTop = document.getElementById("go2top");
function computedDisplay() {
    goTop.style.display = document.body.scrollTop ? 'block' : 'none';
}
window.onscroll = function () {
    scrollNav();
    computedDisplay();
}
goTop.onclick = function () {
    utils.setCss(goTop, 'display', 'none');
    var target = document.body.scrollTop;
    var duration = 500;
    var interval = 10;

    var step = (target / duration) * interval
    var timer = window.setInterval(function () {
        var curT = document.body.scrollTop;
        if (curT <= 90) {
            scrollNav();
        }
        if (curT <= 0) {
            clearInterval(timer);
            return;
        }
        curT -= step;
        utils.win('scrollTop', curT);
    }, interval)
}









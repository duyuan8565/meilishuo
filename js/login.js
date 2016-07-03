//点击图片旋转
var picList = document.getElementById('picList');
var oImgs = picList.getElementsByTagName("img");
for (var i = 0; i < oImgs.length; i++) {
    oImgs[i].onclick = function () {
        this.style.transform += 'rotate(90deg)';
        return;
    }
}



var imgs = [
    'https://i.imgur.com/xR1EO9w.jpg',
    'https://i.imgur.com/ur9xnlR.jpg',
    'https://i.imgur.com/TrKsUIj.jpg',
    'https://i.imgur.com/pxEJUvX.png',
    'https://i.imgur.com/JAylc8a.jpg',
    'https://i.imgur.com/x6TLNOX.jpg',
    'https://i.imgur.com/xGjHtDw.jpg',
    'https://i.imgur.com/S45kKS7.gif',
    'https://i.imgur.com/mEq6tQh.png',
    'https://i.imgur.com/4OvhnNSg.jpg',
    'https://i.imgur.com/H7wfnZK.jpg',
    'https://i.imgur.com/R0SekBQ.jpg',
    'https://i.imgur.com/KxUBLit.jpg',
    'https://i.imgur.com/2FVDiW8b.jpg',
    'https://i.imgur.com/L97JRhbb.jpg',
    'https://i.imgur.com/ctKvhakb.jpg',
    'https://i.imgur.com/uyYfJzU.jpg',
    'https://i.imgur.com/SgTKQyL.gif',
    'https://i.imgur.com/KACaGrr.jpg',
    'https://i.imgur.com/7OSi6j3b.jpg',
    'https://i.imgur.com/qU2FiHKb.jpg',
    'https://i.imgur.com/YRzhi10.jpg',
    'https://i.imgur.com/ynVaDCn.gif',
    'https://i.imgur.com/yOozn3U.jpg',
    'https://i.imgur.com/8WLiG79.png?1',
    'https://i.imgur.com/oAqtIN2.jpg',
    'https://i.imgur.com/hVeIvBhb.jpg',
    'https://i.imgur.com/4dkTkoP.jpg',
    'https://i.imgur.com/ofu2vnZ.jpg',
    'https://i.imgur.com/CyLpEjy.jpg',
    'https://i.imgur.com/bWU1Ofgg.png',
    'https://pp.userapi.com/c824203/v824203504/15bb8e/Iy1Om5TFo-Q.jpg',
    'https://pp.userapi.com/c847021/v847021465/641e8/pNV6ai6_88o.jpg'
];

function Gallery(galleryBlock, progressBar = null) {
    this.galleryBlock = galleryBlock;
    this.progressBar = progressBar;
}

Gallery.prototype.load = function(imgs) {
    this.currentImg = 4;
    this.proccessed = 0;
    this.imgs = imgs;
    for (let i = 0; i < 5; i++) {
        setTimeout(() => this.load_img(imgs[i]), 1);
    }
}

Gallery.prototype.load_img = function(url) {
    console.log(this.proccessed);
    if (url === undefined || url === null)
        return;
    let img = document.createElement('img');
    img.src = 'default-loader.gif';
    img.style = 'max-height: 200px; max-width: 200px; margin: 30px';
    this.galleryBlock.appendChild(img);

    // fetch(url).then((response) => { 
    //     return response.blob()
    // }).then((res_blob) => {
    //     var object_url = URL.createObjectURL(res_blob);
    //     img.src = object_url;
    //     console.log(object_url);
    //     ++this.proccessed;
    //     this.load_img(this.imgs[++this.currentImg]);
    //     this.updateProgressBar();
    // }).catch((error) => {
    //     img.src = 'error.png';
    //     ++this.proccessed;
    //     this.load_img(this.imgs[++this.currentImg]);
    //     this.updateProgressBar();
    // });
    $.ajax({
        type: "GET",
        url: url,
        response
    }).done((data) => {
        let tmp_url = URL.createObjectURL(new Blob([data], {type: 'image/png'}));
        console.log(data);
        img.src = URL.createObjectURL(new Blob([data], {type: 'image/png'}));;
    }).fail((data) => {
        img.src = 'error.png';
    });
}

Gallery.prototype.updateProgressBar = function () {
    if (this.progressBar === undefined || this.progressBar === null)
        return;
    $(this.progressBar).css(
        'width',
        Math.ceil(this.proccessed / this.imgs.length * 100) + '%'
    )
}
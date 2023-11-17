const access_key = 'W1S-wCk5YH80q3CJBRr2wFdUjL8cki-qiHD91BPHdXU';

const unsplashBaseUrl = 'https://api.unsplash.com'

const bike_list = [
    'BWM S1000RR',
    'Ducati panigale',
    'ducati superleggera v4',
    'motorcycle',
    'Yamaha R1',
    'Yamaha R7',
    'Yamaha R6',
    'Yamaha MT10',
    'Yamaha MT09',
    'Yamaha MT07',
    'Honda cbr',
    'KTM Duke',
    'Ninja H2',
    'BWM motorcycle'
]

if(localStorage.getItem("rate_limit_exceeded") == undefined) {
    console.log('reset')
    localStorage.setItem("rate_limit_exceeded", false);
};

const unsplash_api = {
    getRandomPhoto: '/photos/random'
}

const getApiUrl = (apiName) => {
    return `${unsplashBaseUrl}${unsplash_api[apiName]}?client_id=${access_key}`
}

const getRandomBike = (bike_list) => {
    for (let i = bike_list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bike_list[i], bike_list[j]] = [bike_list[j], bike_list[i]];
    }

    return bike_list[0];
}

const getRandomPhoto = (motorbike) => {
    let url = getApiUrl('getRandomPhoto');
    let urlWithQuery = `${url}&orientation=landscape&query=${motorbike}`
    let promise = fetch(urlWithQuery)
                .then(res => {
                    if(res.ok) {
                        res.json();
                    } else {                      
                        return Promise.reject(res);
                    }
                })
                .catch(error => {
                    if(error.status == 403) {
                        localStorage.setItem("rate_limit_exceeded", true);
                        setTimeout(() => {
                            localStorage.setItem("rate_limit_exceeded", false);
                          }, 30 * 60 * 1000);   // 30 mins
                    }
                });
    return promise;
}

const getWallpaper = () => {
    let rate_limit_exceeded = localStorage.getItem("rate_limit_exceeded");
    if(rate_limit_exceeded == 'false') {
        let bike = getRandomBike(bike_list);
        let promise = getRandomPhoto(bike);
        promise.then(data => {
            if(data) {
                // let wallpaper = document.getElementById('wallpaper');
                // wallpaper.style.backgroundImage = `url(${data.urls.full})`;
                let virtualImg = document.getElementById('virtual-wallpaper');
                virtualImg.src = data.urls.full;
            }
        });
    } else {
        console.log('api rate limit exceeded');
    }
}

const onImgLoaded = () => {
    let virtualImg = document.getElementById('virtual-wallpaper');
    let imageUrl = virtualImg.src;
    localStorage.setItem("next_image", imageUrl);
}

const setWallpaper = () => {
    let wallpaper = document.getElementById('wallpaper');
    var imageUrl = localStorage.getItem("next_image");
    if(imageUrl) {
        wallpaper.style.backgroundImage = `url(${imageUrl})`;
    } else {
        wallpaper.style.backgroundImage = 'url(../img/bg.png)';
    }
    window.setTimeout(function(){
        let wallpaper = document.getElementById('wallpaper');
        wallpaper.style.visibility = 'visible';
        wallpaper.style.opacity = 1;
      }, 100);
    // get next image
    getWallpaper();
}

document.getElementById("virtual-wallpaper").addEventListener("load", onImgLoaded);

setWallpaper();
const access_key = 'W1S-wCk5YH80q3CJBRr2wFdUjL8cki-qiHD91BPHdXU';

const unsplashBaseUrl = 'https://api.unsplash.com'

const date_time_format = 'YYYY-MM-DD, HH:mm:ss';

const bike_list = [
    'BMW S1000RR',
    'Ducati panigale',
    'ducati superleggera v4',
    'motorcycle',
    'Yamaha R1',
    'Yamaha R7',
    'Yamaha R6',
    'Yamaha MT10',
    'Yamaha MT09',
    'Yamaha MT07',
    'Honda motorcycle',
    'KTM Duke',
    'Ninja H2',
    'BWM motorcycle',
    'Triumph motorcycle',
    'kawasaki motorcycle'
]

if(localStorage.getItem("rate_limit_exceeded") == undefined) {
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
                        return res.json();
                    } else {                      
                        return Promise.reject(res);
                    }
                })
                .catch(error => {
                    if(error.status == 403) {
                        localStorage.setItem("rate_limit_exceeded", true);
                        var timestamp = moment.utc().format(date_time_format);
                        localStorage.setItem("rate_limit_exceeded_time", timestamp);
                    }
                });
    return promise;
}
const getWallpaper = () => {
    let rate_limit_exceeded = localStorage.getItem("rate_limit_exceeded");
    if(rate_limit_exceeded == 'true') {
        let timestamp_str = localStorage.getItem("rate_limit_exceeded_time");
        if(timestamp_str) {
            let timestamp = moment.utc(timestamp_str, date_time_format);
            let now = moment.utc();
            if(now.isBefore(timestamp.add(65, 'minutes'))) {
                console.log('api rate limit exceeded');
                return;
            } else {
                localStorage.setItem("rate_limit_exceeded", false);
                localStorage.removeItem("rate_limit_exceeded_time");
            }
        } else {
            localStorage.setItem("rate_limit_exceeded", false);
        }     
    }
    let bike = getRandomBike(bike_list);
    let promise = getRandomPhoto(bike);
    promise.then(data => {
        if(data) {
            let virtualImg = document.getElementById('virtual-wallpaper');
            virtualImg.src = data.urls.full;
        }
    });
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
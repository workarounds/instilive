var FB_LOADED = false;
var FB_APP_ID = 977826648899435;
window.fbAsyncInit = function() {
    FB.init({
        appId: FB_APP_ID, // App ID
        channelURL: '/channel.html', // Channel File
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        oauth: true, // enable OAuth 2.0
        xfbml: true // parse XFBML
    });

    FB_LOADED = true;
    $(document).trigger('FB_LOADED');
    // Additional initialization code here
    // angular.bootstrap(document, ['Vnb']);
};

// Load the SDK Asynchronously
(function(d) {
    var js, id = 'facebook-jssdk';
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));

function fblogin() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log(response);
            var url = 'http://localhost/vnb/users/login.json';
            $.ajax({
                type: "JSONP",
                url: url,
                success: function(res) {
                    console.log(res);
                },
                dataType: "jsonp"
            });

        }
    });
}

function getData(uid, accessToken) {
    $.ajax({
            type: 'GET',
            url:'http://localhost/vnb/api/admins/index',
            headers:{
                uid: uid,
                accessToken: accessToken
            },
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            },
            crossDomain: true
        }
    );
}

function fbLogin() {
    var uid;
    var accessToken;
    FB.getLoginStatus(function(response) {
        if(response.status=="connected") {
            uid = response.authResponse.userID;
            accessToken = response.authResponse.accessToken;
            getData(uid, accessToken);
        } else {
            FB.login(function(result) {
                if(result.authResponse) {
                    uid = response.authResponse.userID;
                    accessToken = response.authResponse.accessToken;
                    getData(uid, accessToken);
                }
            }, {scope: 'email'});
        }
    });
}

function check() {
    var url = 'http://localhost/vnb/corners/test';
    $.ajax({
        type: "JSONP",
        url: url,
        success: function(res) {
            console.log(res);
        },
        dataType: "jsonp"
    });
}

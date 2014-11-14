window.fbAsyncInit = function () {
	FB.init({
                appId: 261775467279599, // App ID
                // channelURL: '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                oauth: true, // enable OAuth 2.0
                xfbml: true  // parse XFBML
            });

    // Additional initialization code here
};

// Load the SDK Asynchronously
(function (d) {
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
	FB.login(function (response) {
		if (response.authResponse) {
			console.log(response);
			var url = 'http://localhost/vnb/users/login.json';
			$.ajax({
				type: "JSONP",
				url: url,
				success: function (res) {
					console.log(res);
				},
				dataType: "jsonp"
			});

		}
	});
}

function check () {
	var url = 'http://localhost/vnb/corners/test.json';
	$.ajax({
		type: "JSONP",
		url: url,
		success: function (res) {
			console.log(res);
		},
		dataType: "jsonp"
	});
}
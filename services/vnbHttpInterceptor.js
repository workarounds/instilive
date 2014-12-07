(function(){
    var app = angular.module('Vnb');
    var apiURL = "vnb/api/";
    var uid = 0, accessToken = "";
    var isLoggedIn = function(){
        var loggedIn = false;
        if(FB_LOADED) {
            FB.getLoginStatus(function (response) {
                if (response.status == "connected") {
                    uid = response.authResponse.userID;
                    accessToken = response.authResponse.accessToken;
                    loggedIn = true;
                }
            });
        }
        return loggedIn;
    };
    var getAuthHeaders= function(){
        return {
            uid: uid,
            accessToken: accessToken
        };
    };
    app.factory('VnbHttpInterceptor', ['$q',function($q){
        var uid = 0, accessToken = "";
        return {
            request: function(config){
                if(isLoggedIn() && (config.url.indexOf(apiURL) > -1)){
                    var authHeaders = getAuthHeaders();
                    $.extend(config.headers, authHeaders);
                }
                return config;
            },
            response: function(response){
                var deferred  = $q.defer();
                if(!response){
                    //No response
                    deferred.reject('No response');
                }
                else if(response.config.url.indexOf(apiURL) > -1) {
                    if (response.data) {
                        if (response.data.error) {
                            //error reported by server
                            response.data = response.data.msg;
                            deferred.reject(response);
                        }
                        else if (response.data.success) {
                            //success reported by server
                            response.data = response.data.data;
                            deferred.resolve(response);
                        }
                    }
                    else{
                        //User not logged in
                        response.data = "Please Log in";
                        deferred.reject(response);
                    }
                }
                else{
                    //Non API requests
                    return response;
                }

                return deferred.promise;
            },
            responseError: function(rejection){
                var isAPIcall = (rejection.config.url.indexOf(apiURL) > -1);
                if(rejection.status === 403 && isAPIcall){
                    //Authentication Error
                    //User probably logged out
                    rejection.data = "Please Log In";
                    return $q.reject(rejection);
                }
                return rejection;
            }
        };
    }]);
})();

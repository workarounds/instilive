(function() {
    var app = angular.module('Vnb');

    app.factory('StateService', ['$q','VnbRestangular', function($q,VnbRestangular) {
        var currentState = {};
        var userDetails = false;

        var fetchUserData = function() {
            var deferred = $q.defer();
            VnbRestangular.setJsonp(false);
            VnbRestangular.all('users').get('index').then(
                function(data){
                    userDetails = data;
                    deferred.resolve(data);
                },
                function(err){
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        };

        var facebookLogin = function(){
            var deferred = $q.defer();
            FB.getLoginStatus(function(response) {
                if(response.status==="connected") {
                    deferred.resolve();
                    if(!userDetails) {fetchUserData();}
                } else {
                    FB.login(function(result) {
                        if(result.authResponse) {
                            deferred.resolve();
                            fetchUserData();
                        } else{
                            deferred.reject('could not login');
                        }
                    }, {scope: 'email'});
                }
            });
            return deferred.promise;
        };
        return {
            fbLogin: function(){
                return facebookLogin();
            },
            setState: function($stateParams) {
                currentState.board = $stateParams.board;
                currentState.corner = $stateParams.corner;
                currentState.notice = $stateParams.notice;
            },
            getState: function() {
                return currentState;
            },
            getData: function(state) {
                if (!state) {
                    state = currentState;
                }

                var err = {data:"Network error"};
                var result = $q.reject(err);
                //based on state construct the URL for ajax call
                if(state.notice){
                    var notice = VnbRestangular.all('notices');
                    VnbRestangular.setJsonp(true);
                    result = notice.customGET('index', {id:state.notice});
                    VnbRestangular.setJsonp(false);
                }
                else if(state.corner){
                    var corner = VnbRestangular.all('corners');
                    VnbRestangular.setJsonp(true);
                    result = corner.customGET('index', {tag:state.corner});
                    VnbRestangular.setJsonp(false);
                }
                else if(state.board){
                    var board = VnbRestangular.all('boards');
                    VnbRestangular.setJsonp(true);
                    result = board.customGET('index', {tag:state.board});
                    VnbRestangular.setJsonp(false);
                }
                else{

                }

                //for now returning a dummy
                return result;
            },
            getSidebar: function(){
                return VnbRestangular.all('boards').customGET('sidebar');
            },
            getUserData: function(forceRefresh){
                var deferred = $q.defer();
                if(!userDetails || forceRefresh){
                    fetchUserData().then(
                        function(data){
                            deferred.resolve(data);
                        },
                        function(err){
                            deferred.reject(err);
                        }
                    );
                }
                else{
                    deferred.resolve(userDetails);
                }
                return deferred.promise;
            }
        };
    }]);
})();

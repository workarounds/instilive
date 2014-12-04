(function () {
    var app = angular.module('Vnb');

    app.factory('StateService', ['$rootScope', '$q', 'VnbRestangular', function ($rootScope, $q, VnbRestangular) {
        var currentState = {};
        var userDetails = false;
        var hashData = false;

        var stateService = {};

        var fetchUserData = function () {
            var deferred = $q.defer();
            VnbRestangular.setJsonp(false);
            VnbRestangular.all('users').get('index').then(
                function (data) {
                    userDetails = data;
                    deferred.resolve(data);
                },
                function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        };

        var generateHashData = function(data, deferred){
            var boards = data.boards;
            hashData = {};
            for (var bTag in boards) {
                hashData[bTag] = {
                    name: boards[bTag].title,
                    tag: bTag,
                    is_board: true,
                    sref: bTag+"/all",
                    corners: boards[bTag].corners
                };
                for(var cTag in boards[bTag].corners){
                    hashData[cTag] = {
                        name: boards[bTag].corners[cTag].name,
                        tag: cTag,
                        is_board: false,
                        board_tag: bTag,
                        sref: bTag + "/" + cTag
                    };
                }
            }
            deferred.resolve(data);
            $(document).trigger('VNB_HASH_DATA', hashData);
        };

        stateService.getHashData = function(){
            return hashData;
        };

        stateService.getLoginStatus = function () {
            var deferred = $q.defer();
            if (FB_LOADED) {
                FB.getLoginStatus(function (response) {
                    if (response.status === "connected") {
                        $(document).trigger('FB_LOGGED_IN');

                        deferred.resolve();
                    } else {
                        deferred.reject('not connected');
                    }
                });
            }
            else {
                deferred.reject('FB not loaded');
            }
            return deferred.promise;
        };

        stateService.fbLogin = function () {
            var deferred = $q.defer();
            if (FB_LOADED) {
                FB.getLoginStatus(function (response) {
                    if (response.status === "connected") {
                        deferred.resolve();
                        $(document).trigger('FB_LOGGED_IN');
                        stateService.getUserData();
                    } else {
                        FB.login(function (result) {
                            if (result.authResponse) {
                                deferred.resolve();
                                $(document).trigger('FB_LOGGED_IN');
                                stateService.getUserData(true);
                            } else {
                                deferred.reject('could not login');
                            }
                        }, {scope: 'email'});
                    }
                });
            } else {
                deferred.reject('FB has not yet loaded');
            }
            return deferred.promise;
        };

        stateService.setState = function ($stateParams) {
            currentState.board = $stateParams.board;
            currentState.corner = $stateParams.corner;
            currentState.notice = $stateParams.notice;
        };

        stateService.getState = function () {
            return currentState;
        };

        stateService.getData = function (state) {
            if (!state) {
                state = currentState;
            }

            var err = {data: "Network error"};
            var result = $q.reject(err);
            //based on state construct the URL for ajax call
            if (state.corner) {
                var corner = VnbRestangular.all('corners');
                VnbRestangular.setJsonp(true);
                result = corner.customGET('index', {tag: state.corner});
                VnbRestangular.setJsonp(false);
            }
            else if (state.board) {
                var board = VnbRestangular.all('boards');
                VnbRestangular.setJsonp(true);
                result = board.customGET('index', {tag: state.board});
                VnbRestangular.setJsonp(false);
            }
            else {

            }

            //for now returning a dummy
            return result;
        };

        stateService.getSidebar = function () {
            var request = VnbRestangular.all('boards').customGET('sidebar');
            var deferred = $q.defer();
            request.then(
                function(data){
                    generateHashData(data, deferred);
                }, function(err){
                    console.log(err);
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        stateService.getUserData = function (forceRefresh) {
            var deferred = $q.defer();
            if (!userDetails || forceRefresh) {
                stateService.getLoginStatus().then(
                    function () {
                        fetchUserData().then(
                            function (data) {
                                $rootScope.$broadcast('userDataEvent', data);
                                deferred.resolve(data);
                            },
                            function (err) {
                                deferred.reject(err);
                                console.log(err);
                            }
                        );
                    },
                    function (err) {
                        deferred.reject(err);
                        console.log(err);
                    }
                );
            }
            else {
                deferred.resolve(userDetails);
            }
            return deferred.promise;
        };

        $(document).bind('FB_LOADED', function () {
            stateService.getUserData();
            if (!FB_LOADED) {
                console.log('FB_LOADED = false');
            }
            else {
                console.log('FB_LOADED = true');
            }
        });

        return stateService;
    }]);
})();

(function () {
    var app = angular.module('Vnb');

    app.factory('StateService', [
        '$rootScope',
        '$q',
        'VnbRestangular',
        '$state',
        function ($rootScope, $q, VnbRestangular, $state) {
            var currentState = {};
            var userDetails = false;
            var hashData = false;
            var processingRequest = false;

            var stateService = {};

            stateService.startLoading = function(){
                $rootScope.$emit('vnbLoading', true);
            };

            stateService.stopLoading = function(){
                $rootScope.$emit('vnbLoading', false);
            };

            var fetchUserData = function () {
                var deferred = $q.defer();
                VnbRestangular.setJsonp(false);
                stateService.startLoading();
                VnbRestangular.all('users').get('index').then(
                    function (data) {
                        stateService.stopLoading();
                        userDetails = data;
                        deferred.resolve(data);
                    },
                    function (err) {
                        stateService.stopLoading();
                        deferred.reject(err);
                    }
                );
                return deferred.promise;
            };

            var generateHashData = function (data, deferred) {
                var boards = data.boards;
                hashData = {};
                for (var bTag in boards) {
                    hashData[bTag] = {
                        name: boards[bTag].title,
                        tag: bTag,
                        is_board: true,
                        sref: bTag + "/all",
                        corners: boards[bTag].corners
                    };
                    for (var cTag in boards[bTag].corners) {
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
                $rootScope.$emit('VNB_HASH_DATA', hashData);
            };

            stateService.getHashData = function () {
                return hashData;
            };

            stateService.getLoginStatus = function () {
                var deferred = $q.defer();
                if (FB_LOADED) {
                    FB.init({
                        appId: 977826648899435, // App ID
                        channelURL: '/channel.html', // Channel File
                        status: true, // check login status
                        cookie: true, // enable cookies to allow the server to access the session
                        oauth: true, // enable OAuth 2.0
                        xfbml: true // parse XFBML
                    });
                    FB.getLoginStatus(function (response) {
                        if (response.status == "connected") {
                            $(document).trigger('FB_LOGGED_IN');
                            deferred.resolve(response);
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
                            stateService.startLoading();
                            FB.login(function (result) {
                                stateService.stopLoading();
                                if (result.authResponse) {
                                    deferred.resolve();
                                    $(document).trigger('FB_LOGGED_IN');
                                    stateService.getUserData(true);
                                } else {
                                    //TODO: show toast
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
                currentState.tag = $stateParams.tag;
                currentState.notice = $stateParams.notice;
                $rootScope.$emit('StateChange', currentState);
            };

            stateService.getState = function () {
                return currentState;
            };

            stateService.getData = function (state, options) {
                if (!state) {
                    state = currentState;
                }
                if (!options) {
                    options = {};
                }

                var deferred = $q.defer();
                var result = deferred.promise;
                var request;
                if (!state.tag) {
                    request = VnbRestangular.all('notices');
                    VnbRestangular.setJsonp(true);
                    result = request.customGET('index', options);
                    VnbRestangular.setJsonp(false);
                }
                else {
                    var params = {tag: state.tag};
                    $.extend(params, options);
                    request = VnbRestangular.all('notices');
                    VnbRestangular.setJsonp(true);
                    result = request.customGET('data', params);
                    VnbRestangular.setJsonp(false);
                }
                return result;
            };

            stateService.getSidebar = function () {
                stateService.startLoading();
                var request = VnbRestangular.all('boards').customGET('sidebar');
                var deferred = $q.defer();
                request.then(
                    function (data) {
                        generateHashData(data, deferred);
                        stateService.stopLoading();
                    }, function (err) {
                        stateService.stopLoading();
                        deferred.reject(err);
                    });

                return deferred.promise;
            };

            stateService.getTagData = function (state) {
                if (!state) {
                    state = currentState;
                }

                if(state.tag) {
                    var params = {tag: state.tag};
                    var request = VnbRestangular.all('corners');
                    VnbRestangular.setJsonp(true);
                    var result = request.customGET('meta', params);
                    VnbRestangular.setJsonp(false);
                    return result;
                } else {
                    var deferred = $q.defer();
                    deferred.reject('No Tag');
                    return deferred.promise;
                }
            };

            stateService.getUserData = function (forceRefresh) {
                var deferred = $q.defer();
                if ((!userDetails) || forceRefresh) {
                    stateService.getLoginStatus().then(
                        function () {
                            if (!processingRequest) {
                                processingRequest = true;
                                fetchUserData().then(
                                    function (data) {
                                        processingRequest = false;
                                        $rootScope.$broadcast('userDataEvent', data);
                                        deferred.resolve(data);
                                    },
                                    function (err) {
                                        processingRequest = false;
                                        deferred.reject(err);
                                        console.log(err);
                                    }
                                );
                            }
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


            stateService.getSchedule = function (state, options) {
                if (!state) {
                    state = currentState;
                }
                if (!options) {
                    options = {from: '2012-11-28 11:00:00'};
                }

                var result;
                if (state.tag) {
                    options.tag = state.tag;
                }
                VnbRestangular.setJsonp(true);
                result = VnbRestangular.all('notices').customGET('schedule', options);
                VnbRestangular.setJsonp(false);

                return result;
            };

            stateService.getDefaultHeader = function () {
                var header = {
                    image: '',
                    description: ''
                };
                return header;
            };

            return stateService;
        }]);
})();

(function () {
    var app = angular.module('Vnb');

    app.factory('StateService', [
        '$rootScope',
        '$q',
        'VnbRestangular',
        '$mdToast',
        function ($rootScope, $q, VnbRestangular, $mdToast) {
            var currentState = {};
            var userDetails = false;
            var hashData = false;
            var processingRequest = false;

            var mainData = {
                request: false,
                loading: false,
                tag: false,
                data: false
            };

            var schedule = {
                request: false,
                loading: false,
                tag: false, data: false
            };

            var pinned = {
                request : false,
                loading: false,
                tag: false,
                data: false
            };

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

            stateService.showToast = function(content){
                $mdToast.show(
                    $mdToast.simple()
                        .content(content)
                        .position('bottom right')
                        .hideDelay(3000)
                        .action('OK')
                );
            };

            stateService.fbLogin = function () {
                var deferred = $q.defer();
                console.log('entered fblogin');
                if (FB_LOADED) {
                    FB.getLoginStatus(function (response) {
                        if (response.status === "connected") {
                            deferred.resolve();
                            console.log('response connected');
                            $(document).trigger('FB_LOGGED_IN');
                            stateService.getUserData();
                        } else {
                            stateService.startLoading();
                            FB.login(function (result) {
                                stateService.stopLoading();
                                if (result.authResponse) {
                                    deferred.resolve();
                                    stateService.showToast('Logged in');
                                    $(document).trigger('FB_LOGGED_IN');
                                    stateService.getUserData(true);
                                } else {
                                    stateService.showToast('Could not login. Please try again');
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

            stateService.getPinned = function(state, force){
                if(!state){
                    state = currentState;
                }
                if(!force){
                    force = false;
                }

                var deferred = $q.defer();
                var result = deferred.promise;
                var request;

                if((state.tag == pinned.tag) && !force){
                    if(pinned.loading){
                        return pinned.request;
                    }
                    deferred.resolve(pinned.data);
                    return deferred.promise;
                }
                else{
                    VnbRestangular.setJsonp(true);
                    request = VnbRestangular.all('corners').customGET('pinned', {tag: state.tag});
                    VnbRestangular.setJsonp(false);
                    pinned.tag = state.tag;
                    pinned.request = request;
                    result = request;
                    pinned.loading = true;
                    request.then(function(data){
                        pinned.data = data;
                        pinned.loading = false;
                    }, function(){
                        pinned.data = false;
                        pinned.tag = false;
                        pinned.loading = false;
                    });
                    return result;
                }
            };

            stateService.getData = function (state, options, force) {
                if (!state) {
                    state = currentState;
                }
                if (!options) {
                    options = {};
                }
                if(!force){
                    force = false;
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
                    if((state.tag == mainData.tag) && !force){
                        if(mainData.loading){
                            return mainData.request;
                        }
                        deferred.resolve(mainData.data);
                        return deferred.promise;
                    }
                    else {
                        var params = {tag: state.tag};
                        $.extend(params, options);
                        request = VnbRestangular.all('notices');
                        VnbRestangular.setJsonp(true);
                        result = request.customGET('data', params);
                        VnbRestangular.setJsonp(false);
                        mainData.tag = state.tag;
                        mainData.request = result;
                        mainData.loading = true;
                        result.then(function(data){
                            mainData.data = data;
                            mainData.loading = false;
                        }, function(){
                            mainData.tag = false;
                            mainData.data = false;
                            mainData.loading = false;
                        })
                    }
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


            stateService.getSchedule = function (state, options, force) {
                if (!state) {
                    state = currentState;
                }
                if (!options) {
                    
                }
                if(!force){
                    force = false;
                }

                var result;
                var deferred = $q.defer();
                result = deferred.promise;
                if((state.tag == schedule.tag) && !force){
                    if(schedule.loading){
                        return schedule.request;
                    }
                    console.log('here');
                    deferred.resolve(schedule.data);
                    return deferred.promise;
                }
                else {
                    if (state.tag) {
                        options.tag = state.tag;
                    }
                    VnbRestangular.setJsonp(true);
                    result = VnbRestangular.all('notices').customGET('schedule', options);
                    VnbRestangular.setJsonp(false);
                    schedule.tag = state.tag;
                    schedule.request = result;
                    schedule.loading = true;
                    result.then(function(data){
                        schedule.tag = state.tag;
                        schedule.data = data;
                        schedule.loading = false;
                    }, function(){
                        schedule.data = false;
                        schedule.tag = false;
                        schedule.loading = false;
                    });
                }

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

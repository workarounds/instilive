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
                $(document).trigger('VNB_HASH_DATA', hashData);
            };

            stateService.getHashData = function () {
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
                if (hashData) {
                    //based on state construct the URL for ajax call
                    if (state.tag) {
                        var tag = state.tag;
                        if (!hashData[tag].is_board) {
                            var corner = VnbRestangular.all('corners');
                            VnbRestangular.setJsonp(true);
                            var params = {tag: tag};
                            $.extend(params, options);
                            result = corner.customGET('index', params);
                            VnbRestangular.setJsonp(false);
                        }
                        else {
                            var board = VnbRestangular.all('boards');
                            VnbRestangular.setJsonp(true);
                            var params = {tag: tag};
                            $.extend(params, options);
                            result = board.customGET('index', params);
                            VnbRestangular.setJsonp(false);
                        }
                    }
                    else {
                        var request = VnbRestangular.all('notices');
                        VnbRestangular.setJsonp(true);
                        result = request.customGET('index', options);
                        VnbRestangular.setJsonp(false);
                    }
                }
                else {
                    if (!state.tag) {
                        var request = VnbRestangular.all('notices');
                        VnbRestangular.setJsonp(true);
                        result = request.customGET('index', options);
                        VnbRestangular.setJsonp(false);
                    }
                    else {
                        $(document).one('VNB_HASH_DATA', function () {
                            var request = stateService.getData();
                            request.then(
                                function (data) {
                                    deferred.resolve(data)
                                },
                                function (err) {
                                    deferred.reject(err)
                                }
                            );
                        });
                    }
                }

                //for now returning a dummy
                return result;
            };

            stateService.getSidebar = function () {
                var request = VnbRestangular.all('boards').customGET('sidebar');
                var deferred = $q.defer();
                request.then(
                    function (data) {
                        generateHashData(data, deferred);
                    }, function (err) {
                        console.log(err);
                        deferred.reject(err);
                    });

                return deferred.promise;
            };

            stateService.getUserData = function (forceRefresh) {
                var deferred = $q.defer();
                if ((!userDetails && !processingRequest) || forceRefresh) {
                    processingRequest = true;
                    stateService.getLoginStatus().then(
                        function () {
                            fetchUserData().then(
                                function (data) {
                                    $rootScope.$broadcast('userDataEvent', data);
                                    processingRequest = false;
                                    deferred.resolve(data);
                                },
                                function (err) {
                                    deferred.reject(err);
                                    processingRequest = false;
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

            return stateService;
        }]);
})();

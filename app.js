(function () {
    var app = angular.module(
        'Vnb',
        [
            'ui.bootstrap',
            'ui.utils',
            'ui.router',
            'ngAnimate',
            'ngCookies',
            'vnb.link',
            'vnb.notice',
            'vnb.user',
            'vnb.directives',
            'restangular',
            'ngMaterial',
            'ngImgur',
            'matchmedia-ng',
        ]);

    app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('VnbHttpInterceptor');
        RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        var commonResolve = {
            setStateFunc: ['StateService', '$stateParams',
                function (StateService, $stateParams) {
                    return StateService.setState($stateParams);
                }
            ]
        };

        $stateProvider
            .state('manage', {
                url: '/manage',
                views: {
                    "main@": {
                        templateUrl: 'components/layout/plain-header.html'
                    },
                    "content@manage": {
                        templateUrl: 'components/manage/manage-aliases.html',
                        controller: 'ManageController as manageCtrl'
                    }
                }
            })
            .state('create', {
                url: '/create',
                views: {
                    "main@" : {
                        templateUrl: 'components/layout/plain-header.html'
                    },
                    "content@create" : {
                        templateUrl: 'components/notice/create-event.html',
                        controller: 'CreateEventController as createEventCtrl'
                    }
                },
                resolve: {
                    noticeData: function () {
                        return null;
                    },
                    $modalInstance: function() {
                        return null;
                    }
                }
            })
            ;
        $urlRouterProvider.when('/home', '/interIIT/all');
        $urlRouterProvider.when('/home/', '/interIIT/all');
        $urlRouterProvider.when('/home/all', '/interIIT/all');
        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    "main@": {
                        templateUrl: 'components/tag/tag.html'
                    },
                    "right@home": {
                        templateUrl: 'components/home/right.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('home.direct',{
                url: '/direct/:notice',
                views: {
                    "main@": {
                        templateUrl: 'components/layout/plain-header.html',
                    },
                    "content@home.direct": {
                        templateUrl: 'components/notice/updates.html',
                        controller: 'UpdatesController as updatesCtrl'
                    }
                },
                resolve: {
                    setStateFunc: ['StateService', '$stateParams',
                        function (StateService, $stateParams) {
                            return StateService.setState($stateParams);
                        }
                    ],
                    notice: function () {
                        return null;
                    }
                }
            })
            .state('home.all', {
                url: '/all',
                resolve: commonResolve
            })
            .state('home.notice',{
                url: '/:notice',
                resolve: commonResolve
            })
        ;
        $urlRouterProvider.when('/', '/home/all');
        $urlRouterProvider.when('/:tag', '/:tag/all');
        $urlRouterProvider.when('/:tag/', '/:tag/all');
        $stateProvider
            .state('tag', {
                url: '/:tag',
                views: {
                    "main@": {
                        templateUrl: 'components/tag/tag.html'
                    },
                    "right@tag": {
                        templateUrl: 'components/home/right.html'
                    }
                },
                resolve: commonResolve
            })
            .state('tag.all', {
                url: '/all',
                resolve: commonResolve
            })
            .state('tag.notice', {
                url: '/:notice',
                resolve: commonResolve
            })
            .state('tag.notice.likes', {
                url: '/likes',
                resolve: commonResolve
            })
            .state('tag.notice.comments', {
                url: '/comments',
                resolve: commonResolve
            })
            ;
        /* Add New States Above */
        $urlRouterProvider.otherwise('/home');
    });

    app.run(['$rootScope','$state', function ($rootScope, $state) {
        $rootScope.safeApply = function (fn) {
            var phase = $rootScope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $rootScope.$state = $state;
    }]);

})();

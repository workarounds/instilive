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
            'ngImgur'
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
                        templateUrl: 'manage/manage-aliases.html',
                        controller: 'ManageController as manageCtrl'
                    }
                }
            })
            .state('create', {
                url: '/create',
                views: {
                    "main@" : {
                        templateUrl: 'components/notice/create-event.html',
                        controller: 'CreateEventController as createEventCtrl'
                    }
                },
                resolve: {
                    noticeData: function () {
                        return null;
                    }
                }
            })
            ;
        $urlRouterProvider.when('/home', '/home/all');
        $urlRouterProvider.when('/home/', '/home/all');
        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    "main@": {
                        templateUrl: 'components/tag/tag.html'
                    },
                    "right@": {
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
                        templateUrl: 'components/notice/updates.html',
                        controller: 'UpdatesController as updatesCtrl'
                    },
                    "rightnav@home": {
                        templateUrl: 'components/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
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
        $urlRouterProvider.when('/:tag', '/:tag/all');
        $urlRouterProvider.when('/:tag/', '/:tag/all');
        $stateProvider
            .state('tag', {
                url: '/:tag',
                views: {
                    "main@": {
                        templateUrl: 'components/tag/tag.html'
                    },
                    "right@": {
                        templateUrl: 'components/home/right.html',
                        controller: 'HomeNavController as rightnavCtrl'
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

    app.run(function ($rootScope, $window) {
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

    });
})();

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
            'ngMaterial'
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
            .state('home', {
                url: '/home',
                views: {
                    "main@": {
                        templateUrl: 'components/home/home.html',
                        controller: 'HomeController as homeCtrl'
                    },
                    "rightnav@home": {
                        templateUrl: 'components/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('manage', {
                url: '/manage',
                views: {
                    "main@": {
                        templateUrl: 'manage/manage-aliases.html',
                        controller: 'ManageController as manageCtrl'
                    }
                }
            })
            .state('board', {
                url: '/:board/all',
                views: {
                    "main@": {
                        templateUrl: 'components/board/board.html'
                    },
                    "rightnav@home": {
                        templateUrl: 'components/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('boardCorner', {
                url: '/:board/:corner',
                views: {
                    "main@": {
                        templateUrl: 'components/corner/corner.html'
                    },
                    "rightnav@home": {
                        templateUrl: 'components/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('boardCorner.notice', {
                url: '/:notice',
                resolve: commonResolve
            })
            .state('boardCorner.notice.likes', {
                url: '/likes',
                resolve: commonResolve
            })
            .state('boardCorner.notice.comments', {
                url: '/comments',
                resolve: commonResolve
            })
            .state('board.notice', {
                url: '/:notice',
                resolve: commonResolve
            })
            .state('board.notice.likes', {
                url: '/likes',
                resolve: commonResolve
            })
            .state('board.notice.comments', {
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

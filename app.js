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
            'restangular'
        ]);

    app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('VnbHttpInterceptor');
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
            .state('admin', {
                url:'/admin',
                views: {
                    "main@": {
                        templateUrl: 'admin/create-notice.html',
                        controller: 'AdminController as adminCtrl'
                    }
                }
            })
            .state('corner', {
                url: '/:corner',
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
            .state('notice', {
                url: '/:board/:corner/:notice',
                template: '<test></test>',
                resolve: commonResolve
            })
            ;
        /* Add New States Above */
        $urlRouterProvider.otherwise('/home');

    });

    app.run(function ($rootScope) {

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

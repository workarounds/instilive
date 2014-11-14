(function() {
    var app = angular.module('Vnb', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

    app.config(function($stateProvider, $urlRouterProvider) {
        var commonResolve = {
            setStateFunc: ['NetworkService', '$stateParams',
                function(NetworkService, $stateParams) {
                    console.log('resolve');
                    return NetworkService.setState($stateParams);
                }
            ]
        };

        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    "main@": {
                        templateUrl: '/home/home.html',
                        controller: 'HomeController as homeCtrl'
                    },
                    "rightnav@home": {
                        templateUrl: '/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('corner', {
                url: '/:corner',
                views: {
                    "main@": {
                        templateUrl: '/home/home.html',
                        controller: 'HomeController as homeCtrl'
                    },
                    "rightnav@home": {
                        templateUrl: '/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('board', {
                url: '/:board/all',
                views: {
                    "main@": {
                        templateUrl: '/home/home.html',
                        controller: 'HomeController as homeCtrl'
                    },
                    "rightnav@home": {
                        templateUrl: '/home/rightnav.html',
                        controller: 'HomeNavController as rightnavCtrl'
                    }
                },
                resolve: commonResolve
            })
            .state('notice', {
                url: '/:board/:corner/:notice',
                template: '<test></test>',
                resolve: commonResolve
            });
        /* Add New States Above */
        $urlRouterProvider.otherwise('/home');

    });

    app.run(function($rootScope) {

        $rootScope.safeApply = function(fn) {
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
(function() {
    var app = angular.module('Vnb', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('notice', {
                url: '/:board/:corner/:notice',
                template: '<test></test>',
                resolve: {
                    setState: ['NetworkService', '$stateParams', function(NetworkService, $stateParams) {
                        return NetworkService.setState($stateParams);
                    }]
                }
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
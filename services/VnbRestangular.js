(function () {
    var app = angular.module('Vnb');

    app.factory('VnbRestangular', ['Restangular', function(Restangular){
        return Restangular.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.setBaseUrl('http://localhost/vnb/api/');
            RestangularConfigurer.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
        });
    }]);


})();

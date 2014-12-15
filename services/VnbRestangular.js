(function () {
    var app = angular.module('Vnb');

    app.factory('VnbRestangular', ['Restangular', function(Restangular){
        return Restangular.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.setBaseUrl('http://128.199.251.79/vnb/api/');
            RestangularConfigurer.setJsonp(true);
            RestangularConfigurer.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
        });
    }]);
})();

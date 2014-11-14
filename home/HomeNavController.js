(function () {
    var app = angular.module('Vnb');
    app.controller('HomeNavController', ['NetworkService', function (NetworkService) {
            this.title = "Home Nav";
            this.state = NetworkService.getState();
        }]);
})();
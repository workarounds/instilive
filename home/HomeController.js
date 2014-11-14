(function () {
    var app = angular.module('Vnb');
    app.controller('HomeController', ['NetworkService', '$scope', 
        function (NetworkService, $scope) {
            this.title = "Home";
            this.state = NetworkService.getState();
        }]);
})();
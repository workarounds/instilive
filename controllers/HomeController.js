(function () {
    var app = angular.module('Vnb');
    app.controller('HomeController', ['StateService', '$scope', 
        function (StateService, $scope) {
            this.title = "Home";
            this.state = StateService.getState();
        }]);
})();
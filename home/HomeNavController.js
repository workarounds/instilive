(function () {
    var app = angular.module('Vnb');
    app.controller('HomeNavController', ['StateService', function (StateService) {
            this.title = "Home Nav";
            this.state = StateService.getState();
        }]);
})();
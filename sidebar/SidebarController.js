(function () {
    var app = angular.module('Vnb');
    app.controller('SidebarController', ['NetworkService', function (NetworkService) {
            this.title = "Sidebar";
            this.state = NetworkService.getState();
        }]);
})();
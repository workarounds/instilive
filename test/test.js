(function() {
    var app = angular.module('Vnb');
    app.controller('testCtrl', ['StateService', 'NetworkService', function(StateService, NetworkService) {
        var testCtrl = this;
        this.result = "Init";
        NetworkService.getData().then(
            function(data) {
                testCtrl.result = "This is the data :" + data;
            },
            function(err) {
                testCtrl.result = "Error : " + err;
            }
        );
        //this.result = StateService.getState();
    }]);

    app.directive('test', [function() {
        // Runs during compile
        var directive = {};

        directive.restrict = 'E';
        directive.controller = 'testCtrl';
        directive.controllerAs = 'testCtrl';
        directive.template = '<p>{{testCtrl.result}}</p>';

        return directive;
    }]);
})();
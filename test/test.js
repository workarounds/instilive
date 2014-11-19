(function() {
    var app = angular.module('Vnb');
    app.controller('testCtrl', ['VnbRestangular','$http','StateService', function(VnbRestangular, $http, StateService) {
        var testCtrl = this;
        $http.get('data/notice.json').success(function(data) {
            testCtrl.result = data;
        }).error(function(err){console.log("error: " + err)});
        testCtrl.postData = function() {
            console.log('nothing');
        };
        testCtrl.login = function() {
            $http.get('http://localhost/vnb/users/login.json').success(function(data) {
                console.log(data);
            });
        };
        testCtrl.getSomeData = function() {
            var state = {};
            StateService.getData(state).then(function(data){
                console.log(data);
            },function(err){
                console.log(err);
            });
        };
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

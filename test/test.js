(function() {
    var app = angular.module('Vnb');
    app.controller('testCtrl', ['NetworkService','$http', function(NetworkService, $http) {
        var testCtrl = this;
        $http.get('data/notice.json').success(function(data) {
            testCtrl.result = data;
        }).error(function(err){console.log("error: " + err)});
        testCtrl.postData = function() {
            NetworkService.addNotice(testCtrl.result).success(function(data) {
                console.log(data);
            }).error(function(err){
                console.log(err);
            });
        };
        testCtrl.login = function() {
            $http.get('http://localhost/vnb/users/login.json').success(function(data) {
                console.log(data);
            });
        };
        testCtrl.getSomeData = function() {
            $http.get('http://localhost/vnb/corners/add').success(function(data) {
                console.log(data);
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

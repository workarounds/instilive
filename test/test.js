(function() {
    var app = angular.module('Vnb');
    app.controller('testCtrl', ['$http', function($http) {
        var testCtrl = this;
        $http.get('data/notice.json').success(function(data) {
            testCtrl.result = data;
        });
        testCtrl.postData = function() {
            $http({
                url: 'http://localhost/vnb/admins/createNotice',
                method: "POST",
                data: testCtrl.result,
            }).success(function(data) {
                console.log(data);
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
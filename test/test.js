(function() {
    var app = angular.module('Vnb');
    app.controller('testCtrl', ['VnbRestangular','$http','StateService', function(VnbRestangular, $http, StateService) {
        var testCtrl = this;

        testCtrl.postData = function() {
            //VnbRestangular.all('notices').post({notice:''});
            var notice = {
                notice: testCtrl.result
            }
            VnbRestangular.all('notices').customPOST(notice, 'edit').then(
                function(data){
                    console.log('Successfully added notice');
                },
                function(err){
                    console.log(err);
                }
            );
        };
        testCtrl.login = function() {
            $http.get('http://localhost/vnb/users/login.json').success(function(data) {
                console.log(data);
            });
        };
        testCtrl.getSomeData = function() {
            //var state = {board:"interIIT", corner:"swimming", notice:1};
            //StateService.getData(state).then(function(data){
            //    console.log(data);
            //},function(err){
            //    console.log(err);
            //});
            VnbRestangular.all('notices').customGET('getNoticeJson').then(
                function(data){
                    console.log(data);
                    testCtrl.result = data;
                },
                function(err){
                    console.log(err);
                }
            );
        };
        this.result = StateService.getState();
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

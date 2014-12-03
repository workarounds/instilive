(function() {
    var app = angular.module('vnb.link', []);

    app.directive('vnbLink', [function() {
        // Runs during compile
        return {
            controller:['$scope', 'StateService',function($scope, StateService){
                var hashData = StateService.getHashData();
                if(!hashData){
                    var tag = $scope.obj.tag;
                    $scope.name = hashData[tag].name;
                    $scope.sref = hashData[tag].sref;
                    console.log($scope.sref);
                }
                else{
                    $scope.name = $scope.obj.name;
                    $scope.sref = "/" + $scope.obj.tag;
                }
            }],
            scope: {
                obj: "=data"
            },
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            template: '<a href="#/{{sref}}">{{name}}</a>'
            // link: function($scope, iElm, iAttrs, controller) {

            // }
        };
    }]);
})();

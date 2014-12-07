/**
 * Created by manidesto on 02/12/14.
 */
(function () {
    var app = angular.module('vnb.directives', ['ui.bootstrap']);

    app.directive('vnbTagInput', [function(){
        return {
            controller:['$scope', function($scope){
                $scope.onTagSelect = function (item) {
                    $scope.selectedCorners.push(item);
                    var index = $scope.selectableCorners.indexOf(item);
                    $scope.selectableCorners.splice(index,1);
                    $scope.text = '';
                };
                $scope.onTagRemove = function (index) {
                    var tag = $scope.selectedCorners[index];
                    $scope.selectedCorners.splice(index, 1);
                    $scope.selectableCorners.push(tag);
                };

                function init() {
                    $scope.selectableCorners = [];
                    for (var i = 0; i < $scope.allCorners.length; i++) {
                        if (!($scope.selectedCorners.indexOf($scope.allCorners[i]) > -1)) {
                            $scope.selectableCorners.push($scope.allCorners[i]);
                        }
                    }
                }

                $scope.$watch($scope.allCorners, init);
                $scope.$watch($scope.selectedCorners, init);
            }],
            scope: {
                selectedCorners: "=model",
                allCorners: "=data",
                label: "=label"
            },
            restrict: 'E',
            templateUrl: 'components/vnbTagInput/vnb-tag-input.html'
        };
    }]);
})();
